import React from 'react';
import { connect } from 'react-redux'
import { logsSelector, createPageSizeChangeAction, createPageChangeAction } from './redux';
import LogEntry from './LogEntry.jsx';

export class LogConsoleComponent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            running: true
        };

        this.toggleRunningStatus = this.toggleRunningStatus.bind(this);
        this.changeCurrentPageSize = this.changeCurrentPageSize.bind(this);
        this.changeCurrentPage = this.changeCurrentPage.bind(this);
    }

    shouldComponentUpdate() {
        return this.state.running;
    }

    toggleRunningStatus() {
        this.setState({
            running: !this.state.running
        });
    }

    changeCurrentPageSize(e) {
        this.props.pageSizeChangeAction(e.target.value);
    }

    changeCurrentPage(e) {
        this.props.pageChangeAction(e.target.value*1 - 1);
    }

    render() {
        const pauseResumeClassName = this.state.running ? 'icon pause clickable' : 'icon resume clickable';
        const pages = [];
        const pageCount = Math.ceil(this.props.logCount / this.props.pageSize);
        for (let i = 0; i < pageCount; i++) {
            pages.push(i + 1);
        }
        const currentPage = this.props.currentPage + 1;
        const beginningIndex = this.props.currentPage * this.props.pageSize + 1;
        const endingIndex = Math.min((this.props.currentPage + 1) * this.props.pageSize, this.props.logCount);
        return (
            <div>
                <h2>
                    <span>Log Console ({beginningIndex} - {endingIndex} of {this.props.logCount} entries)</span>
                    <div className={pauseResumeClassName} onClick={this.toggleRunningStatus} />
                </h2>
                <div>
                    <label className='log-console-page-size'>
                        Page Size
                        <select onChange={this.changeCurrentPageSize} value={this.props.pageSize}>
                            <option value="10">10</option>
                            <option value="20">20</option>
                            <option value="30">30</option>
                            <option value="40">40</option>
                            <option value="50">50</option>
                        </select>
                    </label>

                    <label className='log-console-current-page'>
                        Current Page
                        <select onChange={this.changeCurrentPage} value={currentPage}>
                        {pages.map(page => (
                            <option key={page} value={page}>{page}</option>
                        ))}
                        </select>
                    </label>
                </div>
                <ul>
                    {this.props.logs.map(logEntry => (
                        <li className='log-entry' key={logEntry.id}>
                            <LogEntry type={logEntry.messageType} message={logEntry.message} time={logEntry.time} />
                        </li>
                    ))}
                </ul>
            </div>
        );
    }
}

const mapStateToProps = state => {
    const logState = logsSelector(state);
    return {
        logs: logState.logs,
        logCount: logState.count,
        pageSize: logState.pageSize,
        currentPage: logState.currentPage
    };
};

const mapDispatchToProps = dispatch => ({
    pageSizeChangeAction: newSize => {
      dispatch(createPageSizeChangeAction(newSize));
    },
    pageChangeAction: newPage => {
      dispatch(createPageChangeAction(newPage));
    }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LogConsoleComponent);
