import React from 'react'
import ProjectActions from '../actions/projectActions';
import ProjectStore from '../stores/projectStore';
import AgentList from '../components/globalComponents/agentList.jsx';

class Agents extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            agents: ProjectStore.agents,
            currentUser: ProjectStore.currentUser,
            loading: false,
            screenSize: ProjectStore.screenSize,
            toggleModal: ProjectStore.toggleModal
        };
    }

    componentDidMount() {
        this.unsubscribe = ProjectStore.listen(state => this.setState(state));
        this._loadAgents();
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    _loadAgents() {
        ProjectActions.getUser();
        ProjectActions.getUserKey();
        ProjectActions.loadAgents();
    }

    render() {
        return (
            <div>
                <AgentList {...this.props} {...this.state} />
            </div>
        );
    }
}

export default Agents;