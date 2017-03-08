import { h, Component } from "preact";
import scrollMonitor from "scrollmonitor";

export class ScrollSpy extends Component {
  watchers = {};

  state = {
    activeId: this.props.defaultId
  };

  getChildContext() {
    return {
      activeId: this.state.activeId,
      add: this.spy,
      remove: this.remove
    };
  }

  componentWillMount() {
    Object.keys(this.watchers).map(this.remove);
  }

  add = (id, el) => {
    const { offset } = this.props;
    const watcher = scrollMonitor.create(el, offset);
    watcher.stateChange(() => {
      if (watcher.isAboveViewport && watcher.isInViewport) {
        this.setActive(id);
      }
    });
    if (this.watchers[id]) this.remove(id);
    this.watchers[id] = watcher;
  };

  remove = id => {
    if(!this.watchers[id]) return;
    this.watchers[id].destroy();
    delete this.watchers[id];
  };

  setActive = id => {
    if (id !== this.state.activeId) {
      this.setState({
        activeId: id
      });
      if (this.props.updateHash) {
        history.pushState(null, null, "#" + id);
      }
    }
  };

  render({ children }, { activeId }) {
    return children[0];
  }
}

ScrollSpy.defaultProps = {
  updateHash: false
};

export class ScrollSpyItem extends Component {
  componentWillMount() {
    this.context.remove(this.props.id);
  }

  render({ children, id }, state, { add }) {
    return (
      <div id={id} ref={el => add(id, el)}>
        {children}
      </div>
    );
  }
}
