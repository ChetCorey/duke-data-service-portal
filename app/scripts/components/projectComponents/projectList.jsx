import React from 'react';
import PropTypes from 'prop-types';
const { object, bool, array } = PropTypes;
import { observer } from 'mobx-react';
import mainStore from '../../stores/mainStore';
import BaseUtils from '../../util/baseUtils.js';
import { Color } from '../../theme/customTheme';
import { UrlGen } from '../../util/urlEnum';
import AddProjectModal from '../projectComponents/addProjectModal.jsx';
import Loaders from '../globalComponents/loaders.jsx';
import ProjectOptionsMenu from './projectOptionsMenu.jsx';
import ProjectOptions from './projectOptions.jsx';
import {Card, CardTitle, CardText} from 'material-ui/Card';
import FontIcon from 'material-ui/FontIcon';
import RaisedButton from 'material-ui/RaisedButton';
import IconButton from 'material-ui/IconButton';
import Toc from 'material-ui/svg-icons/action/toc';
import ViewModule from 'material-ui/svg-icons/action/view-module';



@observer
class ProjectList extends React.Component {

    render() {
        const { loading, nextPage, projects, projectRoles, toggleListStyle, totalItems } = mainStore;

        return (
            <div className="project-container mdl-grid">
                <div className="mdl-cell mdl-cell--12-col mdl-color-text--grey-800" style={styles.listTitle}>
                    <div style={styles.title}>
                        <h4 style={{margin: 0}}>Projects</h4>
                    </div>
                    <div style={styles.addProjectButton}>
                        <AddProjectModal {...this.props} />
                    </div>
                    <div style={{margin: '6px 10px 0px', float: 'right'}}>
                        <IconButton
                            tooltip={!toggleListStyle ? 'list view' : 'tile view'}
                            onClick={() => this.toggleListStyle()}
                            iconStyle={{width: 36, height: 36}}
                            style={{width: 36, height: 36, padding: 0}}
                            hoveredStyle={{ zIndex: 9999 }}
                        >
                            {!toggleListStyle ? <Toc /> : <ViewModule />}
                        </IconButton>
                    </div>
                    <Loaders {...this.props} />
                    <ProjectOptions {...this.props} />
                </div>
                { projects ? projects.map((project) => {
                    let role = projectRoles.get(project.id);
                    return (
                        <Card key={ project.id } className="mdl-cell mdl-cell--4-col mdl-cell--8-col-tablet" style={styles.card}>
                            <FontIcon className="material-icons" style={styles.icon}>content_paste</FontIcon>
                            {role && role === 'Project Admin' && <div style={styles.menuIcon} onClick={(e) => {e.stopPropagation()}}><ProjectOptionsMenu {...this.props} clickHandler={()=>this.setSelectedProject(project.id)}/></div>}
                            <a href={UrlGen.routes.project(project.id)} className="external">
                                <CardTitle title={project.name} titleColor="#424242" style={styles.cardTitle}/>
                                <CardTitle subtitle={'Created On: ' + BaseUtils.formatDate(project.audit.created_on)} titleColor="#424242" style={styles.cardTitle}/>
                                <CardTitle subtitle={role !== undefined ? 'Project Role: ' + role : 'Project Role:'} titleColor="#424242" style={styles.cardTitle2}/>
                            </a>
                            <CardText>
                                <span className="mdl-color-text--grey-900">Description:</span>{ project.description.length > 300 ? ' ' + project.description.substring(0,300)+'...' : ' ' + project.description }
                            </CardText>
                        </Card>
                    );
                }) : null }
                {projects && projects.length < totalItems ? <div className="mdl-cell mdl-cell--12-col">
                    <RaisedButton
                        label={loading ? "Loading..." : "Load More"}
                        secondary={true}
                        disabled={!!loading}
                        onTouchTap={()=>this.loadMore(nextPage)}
                        fullWidth={true}
                        style={loading ? {backgroundColor: Color.ltBlue2} : {}}
                        labelStyle={loading ? {color: Color.blue} : {fontWeight: '100'}}/>
                    </div> : null}
            </div>
        );
    }

    loadMore(page) {
        mainStore.getProjects(page);
    }

    setSelectedProject(id) {
        mainStore.setSelectedProject(id);
    }

    toggleListStyle() {
        mainStore.toggleListView();
    }
}

const styles = {
    addProjectButton: {
        margin: '6px -16px 0px 12px',
        float: 'right'
    },
    card: {
        minHeight: 260,
        padding: 10
    },
    cardTitle: {
        fontWeight: 200,
        marginBottom: -15,
        marginRight: 24,
        wordWrap: 'break-word'
    },
    cardTitle2: {
        fontWeight: 200,
        marginBottom: -15,
        padding: '4px 4px 4px 16px'
    },
    icon: {
        fontSize: 36,
        float: 'left',
        margin: '20px 15px 0px 13px',
        color: Color.dkGrey2
    },
    listTitle: {
        margin: 0,
        padding: 8,
        textAlign: 'left',
        float: 'left'
    },
    menuIcon: {
        float: 'right',
        marginTop: 19,
        marginRight: 3
    },
    title: {
        margin: 0,
        padding: '8px 0px',
        textAlign: 'left',
        float: 'left'
    }
};

ProjectList.propTypes = {
    loading: bool,
    projects: array,
    responseHeaders: object
};

export default ProjectList;