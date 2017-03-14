import React from 'react'
import { observer } from 'mobx-react';
import agentStore from '../stores/agentStore';
import authStore from '../stores/authStore';
import AgentList from '../components/globalComponents/agentList.jsx';

@observer
class Agents extends React.Component {

    componentDidMount() {
        this._loadAgents();
    }

    _loadAgents() {
        authStore.getUserKey();
        agentStore.loadAgents();
    }

    render() {
        return (
            <div>
                <AgentList {...this.props} />
            </div>
        );
    }
}

export default Agents;