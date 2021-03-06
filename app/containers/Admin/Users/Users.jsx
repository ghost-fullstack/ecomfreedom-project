import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { map } from 'lodash';
import moment, * as moments from 'moment';
// @material-ui/core components
import withStyles from '@material-ui/core/styles/withStyles';
import Fab from '@material-ui/core/Fab';
import TextField from '@material-ui/core/TextField';
// core components
import Modal from 'components/Modal/Modal';
import GridItem from 'components/Grid/GridItem.jsx';
import GridContainer from 'components/Grid/GridContainer.jsx';
import TableList from 'components/Table/TableList';
import Card from 'components/Card/Card.jsx';
// import CardHeader from 'components/Card/CardHeader.jsx';
import CardBody from 'components/Card/CardBody';
import AdminNavbar from 'components/Navbars/AdminNavbar';
import AdminContent from 'components/Content/AdminContent';
import { getUsers, createUsers, deleteUsers } from 'redux/actions/users';
import { PAGINATION } from 'constants/default';

const styles = {
  cardCategoryWhite: {
    '&,& a,& a:hover,& a:focus': {
      color: 'rgba(255,255,255,.62)',
      margin: '0',
      fontSize: '14px',
      marginTop: '0',
      marginBottom: '0'
    },
    '& a,& a:hover,& a:focus': {
      color: '#FFFFFF'
    }
  },
  cardTitleWhite: {
    color: '#FFFFFF',
    marginTop: '0px',
    minHeight: 'auto',
    fontWeight: '300',
    fontFamily: "Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: '3px',
    textDecoration: 'none',
    '& small': {
      color: '#777',
      fontSize: '65%',
      fontWeight: '400',
      lineHeight: '1'
    }
  },
  fab: {
    background: 'orange',
    elevation: 1
  }
};

class Users extends Component {
  state = {
    open: false,
    openConfirm: false,
    editId: null,
    deleteItem: null,
    name: '',
    description: '',
    pagination: PAGINATION
  };

  componentDidMount() {
    const { pagination } = this.state;
    const { getUsersAction } = this.props;

    getUsersAction({ pagination });
  }

  handleAddNew = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false, openConfirm: false, name: '', description: '', editId: null, deleteItem: null });
  };

  handleSubmit = () => {
    const { name, description, editId } = this.state;
    const { createUserAction } = this.props;
    const payload = { name, description };

    if (editId) {
      payload.id = editId;
    }

    createUserAction(payload);
    this.handleClose();
  };

  onChange = field => event => {
    this.setState({ [field]: event.target.value });
  };

  prepareData = data =>
    map(data, item => {
      const { roles, created, loginLast, loginCount, firstname, lastname, ...rest } = item;

      return {
        ...rest,
        firstname: firstname || '',
        lastname: lastname || '',
        roles: map(roles, p => p.name).join(', '),
        created: created && moment(created).format('YYYY-MM-DD HH:mm:ss'),
        loginLast: loginLast && moment(loginLast).format('YYYY-MM-DD HH:mm:ss'),
        loginCount
      };
    });

  changePage = pagination => {
    const { getUsersAction } = this.props;

    this.setState({ pagination });
    getUsersAction({ pagination });
  };

  renderConfirm = () => {
    const { openConfirm } = this.state;

    return (
      <Modal
        open={openConfirm}
        maxWidth="md"
        onClose={this.handleClose}
        onSubmit={this.handleDeleteConfirmed}
        description="Are you sure you want to delete this element?"
        okTitle="Delete"
      />
    );
  };

  renderNavbar = classes => (
    <Fab variant="extended" size="medium" aria-label="like" className={classes.fab} onClick={this.handleAddNew}>
      Add User
    </Fab>
  );

  renderModal = () => {
    const { open, name, description } = this.state;

    return (
      <Modal
        open={open}
        maxWidth="md"
        onClose={this.handleClose}
        onSubmit={this.handleSubmit}
        title="Add New User"
        okTitle="Save"
      >
        <TextField
          autoFocus
          margin="dense"
          id="name"
          name="name"
          label="Name"
          type="text"
          fullWidth
          value={name}
          onChange={this.onChange('name')}
        />
        <TextField
          autoFocus
          margin="dense"
          id="description"
          name="description"
          label="Description"
          type="text"
          fullWidth
          value={description}
          onChange={this.onChange('description')}
        />
      </Modal>
    );
  };

  render() {
    const { data, total } = this.props;
    const { pagination } = this.state;

    return (
      <>
        <AdminContent>
          <AdminNavbar title="Users" />
          <GridContainer>
            <GridItem xs={12} sm={12} md={12}>
              <Card>
                <CardBody>
                  <TableList
                    tableHeaderColor="info"
                    tableHead={['Email', 'First Name', 'Last Name', 'Roles', 'Created', 'Last Login', 'Login Count']}
                    tableColumns={['email', 'firstname', 'lastname', 'roles', 'created', 'loginLast', 'loginCount']}
                    tableData={this.prepareData(data)}
                    total={total}
                    pagination={pagination}
                    onChangePage={this.changePage}
                  />
                </CardBody>
              </Card>
            </GridItem>
          </GridContainer>
        </AdminContent>
        {this.renderModal()}
        {this.renderConfirm()}
      </>
    );
  }
}

Users.propTypes = {
  getUsersAction: PropTypes.func.isRequired,
  createUserAction: PropTypes.func.isRequired,
  deleteUserAction: PropTypes.func.isRequired,
  data: PropTypes.array,
  total: PropTypes.number
};

const mapStateToProps = ({ users }) => ({
  data: users.users.data,
  total: users.users.total
});

const mapDispatchToProps = dispatch => ({
  getUsersAction: data => {
    dispatch(getUsers(data));
  },
  createUserAction: data => {
    dispatch(createUsers(data));
  },
  deleteUserAction: data => {
    dispatch(deleteUsers(data));
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(Users));
