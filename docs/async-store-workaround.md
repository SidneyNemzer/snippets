# The Observed Problem

The cursor could jump around in the text editors, especially when typing quickly or inserting a suggestion from the text editor (aka Ace snippet).

**TLDR: Ace works when store updates are synchronous, but webext-redux causes updates to be asynchronous**

What the heck does that mean? Well, I'm glad you asked!

When events are synchronous, they are processed by Ace and Redux in the order they occur. When events are asynchronous, events might get processed out of order.

Let's look at the difference between an synchronous and asynchronous update:

# Synchronous Update

(react + react-redux + react-ace)

1. Browser emits keyboard event in DOM
2. Ace updates internal state
3. Ace emits 'change'
4. dispatch `updateEditorValue` on store
5. update store state via reducer
6. react-redux re-renders editor component
7. editor component passes value to react-ace

Ace updated in step 2, so the value prop and internal value are now equal

If another key is pressed before this finishes, the browser holds the event in a queue before firing it because JavaScript is not designed to be interrupted while it's running.

# Asynchronous Update

(react + react-redux + react-ace + webext-redux)

Events basically follow the same steps here, but `webext-redux` makes the processing asynchronous, because it has to pass messages through the runtime API to get them to the redux store and back to the react app.

![diagram of Redux updates with webext-redux](https://camo.githubusercontent.com/1eb2b13d733b8ade35770c439473bb1cf5bd3ef5/68747470733a2f2f692e696d6775722e636f6d2f33454e554d6a302e706e67)

Source: [webext-redux wiki](https://github.com/tshaddix/webext-redux/wiki/Introduction#webext-redux)

Events start in a devtools panel, content script, or popup. In Snippets, this is a devtools panel.

1. Browser emits keyboard event in DOM
2. Ace updates internal state
3. Ace emits 'change'
4. dispatch `updateEditorValue` on store
5. dispatch is sent to background page using the runtime API

Between step 5 and 9, the devtools panel is able to process new DOM events.

_In the background page_

6. Receive dispatch message from devtools panel
7. update store state via reducer
8. webext-redux broadcasts the new state

_Back in the devtools panel_

9. Receive state update message from runtime API
10. react-redux re-renders editor component
11. editor component passes value to Ace

If no other events have come in since step 5, the prop passed to react-ace and Ace's value are now equal, and there's no problem.

However, if Ace has already received other keyboard events, the store will have an old value. (The new value is still propagating through the same process). Ace gets the stale value, even though Ace already had the newest value!

When updates are synchronous, Ace can only be one event ahead of the store.

When updates are asynchronous, and Ace might get more than one event ahead of the store, which causes the events to be "replayed" as Ace receives them from the store. It causes all kinds of desyc bugs, the most obvious being the cursor can jump around.

# Potential Solutions

### Debounce `onChange`

Difficulty to implement: very easy  
Pros: easy  
Cons: won't totally prevent the problem

If we debounce the dispatching of onChange, we can accumulate consecutive events. However this introduces a delay in updating the store, and it is not bulletproof; new events might still come in when we finally decide to dispatch, regardless of how long we wait.

### Stop Ace from processing new DOM events until the store has caught up

Difficulty to implement: hard  
Pros: should allow syncing editors between pages  
Cons: unknown

Basically implement our own event queue. We need to know when an event has fully propagated back to Ace before firing the next event.

### Use an uncontrolled editor

Difficulty to implement: easy\*  
Pros: easy\*  
Cons: \*unless we have multiple editors

This is easy to implement, but comes with a problem: if we have editors in different devtool panels, we need some way to sync them up. This could be worked around by using a single editor. Otherwise we need to identify which editor caused the updates, and update the value of all _other_ editors.

### Fire 'versioned' state updates

Difficulty to implement: unknown (but probably really hard)  
Pros: solves our original problem (not much else)  
Cons: unknown

We can assign each dispatch a generation version. As values come back from the store, we can compare them to Ace's value, and ignore generations that are behind what Ace has. Tracking the version will be... interesting, to say the least. Especially across devtool panels. We can't keep it in the redux store, because it has to be based on Ace's internal state.

### Synchronously dispatch events in webext-redux

Difficulty to implement: really hard  
Pros: redux should be synchronous anyway  
Cons: see difficulty

Each devtools panel store would run reducers itself and synchronously re-render. However this means the store in the background page is no longer the single-source of truth. It would require some kind of conflict resolution to keep the panels and the background store in sync... maybe we could use a Git-like system (panel stores are individual repos and background store is the remote)? That seems like overkill though.

Technically, Redux is normally synchronous and webext-redux breaks that part of Redux. I don't know how many applications are affected by it though.

### Remove Ace's internal state

Difficulty to implement: really hard  
Pros: Who doesn't want a pure(1) Ace implementation?  
Cons: see difficulty

The only reason this is a problem is because there are two sources of truth: redux and Ace. If Ace only uses the provided value, instead of using internal state, we can avoid Ace getting ahead of Redux. However, this _could_ cause a noticeable lag while typing. I'm not sure though.

It's "really hard" because you would need to rip out ALL of Ace's internal state and move it to the redux store. Technically possible, but Ace is not designed to allow that.

1: "Pure" here means "no side effects" (including internal state)

### Remove webext-redux from Snippets

Difficulty to implement: hard  
Pros: solves our original problem (not much else)  
Cons: major architecture change

We could use a different system to sync editors, remove syncing entirely, or remove editors from the devtools and use a single editor.

# Chosen Solution

### Use an uncontrolled editor

I chose this option because it works with the current design (where each devtools panel has its own editor), and it doesn't require modifying any libraries.

I added a new value to each snippet in the Redux store, `lastUpdatedBy`. As state updates come in from Redux, each editor will ignore updates that were dispatched from themselves, while updating their state to match updates from other editors.
