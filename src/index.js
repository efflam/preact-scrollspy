import { h, Component } from "preact";
import scrollMonitor from "scrollmonitor";

export class ScrollSpy extends Component {
  items = {};
  watchers = {};

  state = {
    activeId: this.props.defaultId
  };

  getChildContext() {
    return {
      activeId: this.state.activeId,
      spy: this.spy
    };
  }

  componentWillMount() {
    // TODO: clean up
  }

  spy = (id, el) => {
    const { offset } = this.props;
    const watcher = scrollMonitor.create(el, offset);
    watcher.stateChange(() => {
      if (watcher.isAboveViewport && watcher.isInViewport) {
        this.setActive(id);
      }
    });
    this.items[id] = el;
    this.watchers[id] = watcher;
  };

  setActive(id) {
    if (id !== this.state.activeId) {
      this.setState({
        activeId: id
      });
      if (this.props.updateHash) {
        history.pushState(null, null, "#" + id);
      }
    }
  }

  render({ children }, { activeId }) {
    return children[0];
  }
}

ScrollSpy.defaultProps = {
  updateHash: false
};

export class ScrollSpyItem extends Component {
  render({ children, id }, state, { spy }) {
    return (
      <div id={id} ref={el => spy(id, el)}>
        {children}
      </div>
    );
  }
}
