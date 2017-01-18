import React from 'react';
import { RouteHandler } from 'react-router';
import ProjectActions from '../../actions/projectActions';
import AddProjectModal from '../projectComponents/addProjectModal.jsx';
import Loaders from '../../components/globalComponents/loaders.jsx';
import {UrlGen} from '../../../util/urlEnum';
import Card from 'material-ui/lib/card/card';
import CardText from 'material-ui/lib/card/card-text';
import CardTitle from 'material-ui/lib/card/card-title';
import FontIcon from 'material-ui/lib/font-icon';
import RaisedButton from 'material-ui/lib/raised-button';

class ProjectList extends React.Component {

    render() {
        let headers = this.props.responseHeaders && this.props.responseHeaders !== null ? this.props.responseHeaders : null;
        let nextPage = headers !== null && !!headers['x-next-page'] ? headers['x-next-page'][0] : null;
        let totalProjects = headers !== null && !!headers['x-total'] ? headers['x-total'][0] : null;
        let projects = this.props.projects.map((project) => {
            return (
                <Card key={ project.id } className="mdl-cell mdl-cell--4-col mdl-cell--8-col-tablet" style={styles.card}>
                    <FontIcon className="material-icons" style={styles.icon}>content_paste</FontIcon>
                    <a href={UrlGen.routes.project(project.id)} className="external">
                        <CardTitle title={project.name} subtitle={'ID: ' + project.id} titleColor="#424242" style={styles.cardTitle}/>
                    </a>
                    <CardText>
                        <span className="mdl-color-text--grey-900">Description:</span>{ project.description.length > 300 ? ' ' + project.description.substring(0,300)+'...' : ' ' + project.description }
                    </CardText>
                </Card>
            );
        });

        return (
            <div className="project-container mdl-grid">
                <div className="mdl-cell mdl-cell--12-col mdl-color-text--grey-800" style={styles.listTitle}>
                    <div style={styles.title}>
                        <h4>Projects</h4>
                    </div>
                    <AddProjectModal {...this.props} />
                    <Loaders {...this.props}/>
                </div>
                { projects }
                {this.props.projects.length < totalProjects ? <div className="mdl-cell mdl-cell--12-col">
                        <RaisedButton
                            label={this.props.loading ? "Loading..." : "Load More"}
                            secondary={true}
                            onTouchTap={()=>this.loadMore(nextPage)}
                            fullWidth={true}
                            labelStyle={{fontWeight: '100'}}/>
                    </div> : null}
            </div>
        );
    }

    loadMore(page) {
        ProjectActions.getProjects(page);
    }
}

var styles = {
    card: {
        minHeight: 260,
        padding: 10
    },
    cardTitle: {
        fontWeight: 200,
        marginBottom: -15
    },
    icon: {
        fontSize: 36,
        float: 'left',
        margin: '20px 15px 0px 13px',
        color: '#616161'
    },
    listTitle: {
        margin: '0px 0px 0px 0px',
        textAlign: 'left',
        float: 'left',
        paddingLeft: 20
    },
    title: {
        margin: '-10px 0px 0px 0px',
        textAlign: 'left',
        float: 'left',
        marginLeft: -14
    }
};

ProjectList.contextTypes = {
    muiTheme: React.PropTypes.object
};

ProjectList.propTypes = {
    loading: React.PropTypes.bool,
    projects: React.PropTypes.array,
    error: React.PropTypes.object
};

export default ProjectList;