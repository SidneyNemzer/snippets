import React from "react";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import IconButton from "@material-ui/core/IconButton";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import MoreVert from "@material-ui/icons/MoreVert";
import Edit from "@material-ui/icons/Edit";
import PlayArrow from "@material-ui/icons/PlayArrow";
import Delete from "@material-ui/icons/Delete";

class SnippetSelector extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isRenaming: false,
      startingRename: false,
      menuAnchor: null,
      menuOpen: false
    };

    this.startRename = this.startRename.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.handleMenuOpen = this.handleMenuOpen.bind(this);
    this.handleMenuClose = this.handleMenuClose.bind(this);
  }

  startRename() {
    this.setState({
      isRenaming: true,
      startingRename: true,
      currentInput: this.props.name,
      menuOpen: false
    });
  }

  handleChange(event) {
    this.setState({
      currentInput: event.target.value,
      startingRename: false
    });
  }

  handleBlur() {
    const { currentInput } = this.state;
    this.setState(
      {
        isRenaming: false
      },
      () => {
        this.props.updateName(currentInput);
      }
    );
  }

  handleKeyPress(event) {
    // End the rename when 'enter' is hit
    if (event.key === "Enter") {
      this.nameInput.blur();
    }
  }

  handleMenuOpen(event) {
    this.setState({
      menuAnchor: event.currentTarget,
      menuOpen: true
    });
  }

  handleMenuClose() {
    this.setState({
      menuOpen: false
    });
  }

  componentDidUpdate() {
    if (this.state.isRenaming && this.state.startingRename) {
      // Without the delay, the input instantly loses focus...
      // not sure why
      setTimeout(() => {
        this.nameInput.select();
        this.nameInput.focus();
      }, 350); // With any lower delay, 'nameInput' is undefined
    }
  }

  renderName() {
    const { isRenaming } = this.state;
    const { name } = this.props;

    if (isRenaming) {
      // TODO use material ui input
      return (
        <input
          ref={input => {
            this.nameInput = input;
          }}
          value={this.state.currentInput}
          onChange={this.handleChange}
          onBlur={this.handleBlur}
          onKeyPress={this.handleKeyPress}
        />
      );
    } else {
      return <ListItemText primary={name} />;
    }
  }

  render() {
    const { selected } = this.props;

    // TODO maybe disable ListItem.button and Menu icon when renaming
    return (
      <ListItem
        button={true}
        onClick={selected ? () => {} : () => this.props.selectSnippet()}
        className={selected ? "selected" : ""}
      >
        {this.renderName()}
        <ListItemSecondaryAction>
          <IconButton
            className="menu-icon"
            onClick={event => {
              if (!selected) {
                this.props.selectSnippet();
              }

              this.handleMenuOpen(event);
            }}
          >
            <MoreVert />
          </IconButton>
          <Menu
            anchorEl={this.state.menuAnchor}
            open={this.state.menuOpen}
            onClose={this.handleMenuClose}
          >
            <MenuItem onClick={this.startRename}>
              <Edit />
              Rename
            </MenuItem>
            <MenuItem onClick={this.props.runSnippet}>
              <PlayArrow />
              Run
            </MenuItem>
            <MenuItem onClick={this.props.deleteSnippet}>
              <Delete />
              Delete
            </MenuItem>
          </Menu>
        </ListItemSecondaryAction>
      </ListItem>
    );
  }
}

export default SnippetSelector;
