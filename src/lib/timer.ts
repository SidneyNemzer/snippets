// The min and max values here define a range where both setTimeout and
// chrome.alarms will be used for reliability.
const MAX_SAFE_SET_TIMEOUT = 25 * 1000;
const MIN_SAFE_ALARM = 30 * 1000;

/**
 * Timer represents a delay that can be set and cancelled. It can only have one
 * delay at a time; calling `set` multiple times cancels the previous delay.
 *
 * The timer must be created synchronously when the service worker starts, to
 * guarantee that chrome alarm events will be received.
 *
 * A callback must be provided with `setCallback`. This may be done at any point
 * after creating the timer. The callback will be called for each time the timer
 * finished, even if the timer expired before the callback was set.
 *
 * Internally, delays are handled like so:
 * - If the delay is less than 25 seconds, setTimeout is used.
 * - If the delay is between 25 and 30 seconds, both setTimeout and chrome.alarms are
 *   used. The callback will only be called once.
 * - If the delay is more than 30 seconds, only a chrome.alarms is used.
 *
 * Note that chrome alarms can only be set for a minimum of 30 seconds, but the
 * range between 25 and 30 is handled by both for reliability.
 *
 * `set` and `cancel` are async because the chrome alarms API is async.
 */
export const createTimer = (name: string) => {
  let timeout: ReturnType<typeof setTimeout> | undefined;

  let setCallback: (callback: () => void) => void;
  const callback: Promise<() => void> = new Promise((resolve) => {
    setCallback = resolve;
  });

  /**
   * @returns Whether the timer was cancelled, `false` if no timer was running.
   */
  const cancel = async () => {
    let cleared = false;

    if (timeout) {
      clearTimeout(timeout);
      timeout = undefined;
      cleared = true;
    }

    cleared = (await chrome.alarms.clear(name)) || cleared;

    return cleared;
  };

  const onTimeout = async () => {
    await cancel();
    // Awaiting the callback queues the event until the callback is ready
    (await callback)();
  };

  const onAlarm = async (alarm: chrome.alarms.Alarm) => {
    if (alarm.name !== name) {
      return;
    }

    await cancel();
    // Awaiting the callback queues the event until the callback is ready
    (await callback)();
  };

  const set = async (delay: number) => {
    await cancel();

    if (delay > MAX_SAFE_SET_TIMEOUT) {
      await chrome.alarms.create(name, {
        when: Math.max(Date.now() + delay, MIN_SAFE_ALARM),
      });
    }

    if (delay < MIN_SAFE_ALARM) {
      timeout = setTimeout(onTimeout, delay);
    }
  };

  chrome.alarms.onAlarm.addListener(onAlarm);

  return {
    set,
    cancel,
    // setCallback is guaranteed to exist because Promise runs its callback
    // synchronously.
    setCallback: setCallback!,
  };
};
