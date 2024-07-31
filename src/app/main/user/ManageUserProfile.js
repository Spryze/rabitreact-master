import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Button,
  Link,
  CardContent,
  Container,
  Paper,
  Typography,
  Card,
  Grid,
  CircularProgress,
  Alert,
  Tab,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import Tabs, { tabsClasses } from '@mui/material/Tabs';
import TextField from '@mui/material/TextField';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import DefaultImg from 'src/assets/Default/DegaultImg.gif';
import Property from '../Properties/Property';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { motion } from 'framer-motion';
import {
  getUserProfileOnSearch,
  postPaymentDetailsAdd,
  putPaymentDetailsUpdate,
  selectSearchUserProfile,
  updateManageUserProfile,
} from './ManageSearchSlice';
import MySubscriptions from '../Properties/Pages/MySubscriptions';
import { AddIntrests, selectManageUserSubscription } from '../Properties/PropertySlice1';
import Users from '../user/Users';
// import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { containerStyle, GetBackButton } from 'src/misc/helpers';

const ManageUserProfile = () => {
  const { userId } = useParams();

  const navigate = useNavigate();

  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const usersSearchResult = useSelector(selectSearchUserProfile);
  console.log('usersSearchResult', usersSearchResult);

  const [isUserDataFound, setUserDataFound] = useState(false);
  const [localError, setLocalError] = useState(null);
  let userDataTemp;
  const [userData, setUserData] = useState(null);

  console.log('userData check', userData);
  const [value, setValue] = useState(0);
  const [change, setChange] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const manageUserSubscription = useSelector(selectManageUserSubscription);
  console.log('manageUserSubscription', manageUserSubscription);
  const [role, setRole] = useState('');
  const [planType, setPlanType] = useState('');
  const [comments, setComments] = useState('');
  const [PaymentStatus, setPaymentStatus] = useState('');
  const [OrderId, setOrderIdStatus] = useState('');
  const [openPaymentDialog, setOpenPaymentDialog] = useState(false);

  const [isNewPayment, setIsNewPayment] = useState(false);
  const [commentformData, setCommentFormData] = useState({
    subscription_plan_type: '',
    v_comments: '',
    role: '',
    payment_status: '',
  });
  // have to check based on user login profile role
  const isAdmin = true;
  const PaymentFields = [
    { id: 'payment_id', label: 'Payment ID', minWidth: 170, align: 'center' },
    { id: 'transaction_id', label: 'Transaction ID', minWidth: 170, align: 'center' },
    { id: 'order_id', label: 'Order ID', minWidth: 100, align: 'center' },
    { id: 'from_date', label: ' Plan Starts', minWidth: 170, align: 'center' },
    { id: 'to_date', label: ' Plan Ends', minWidth: 170, align: 'center' },
    { id: 'subscription_plan_type', label: 'Plan Type', minWidth: 170, align: 'center' },
    { id: 'Payment_status', label: 'Payment Status', minWidth: 170, align: 'center' },
    { id: 'payment_gateway', label: ' Payment GateWay', minWidth: 170, align: 'center' },
    { id: 'payment_date', label: ' Payment Date', minWidth: 170, align: 'center' },
    { id: 'comments', label: ' comments', minWidth: 170, align: 'center' },
    { id: 'active_notifications', label: ' Active Notifications', minWidth: 170, align: 'center' },
  ];

  const [paymentDialogValues, setPaymentDialogValues] = useState({
    payment_id: '',
    transaction_id: '',
    order_id: '',
    subscription_plan_type: '',
    payment_status: '',
    payment_gateway: '',
    payment_date: '',
    comments: '',
    active_notifications: '',
  });
  const EditableFieldsForAddPayments = [
    'subscription_plan_type',
    'transaction_id',
    'payment_date',
    'Payment_status',
    'payment_gateway',
    'comments',
  ];

  const handleChangeInPaymentDialog = (e) => {
    const { name, value } = e.target;

    setPaymentDialogValues({
      ...paymentDialogValues,
      [name]: name === 'active_notifications' ? parseInt(value, 10) : value,
    });
  };

  const handleDateChangeInPaymentDialog = (fieldId, newValue) => {
    setPaymentDialogValues({
      ...paymentDialogValues,
      [fieldId]: newValue.toISOString(),
    });
  };
  const handleDateChange = (newValue) => {
    setPaymentDialogValues({
      ...paymentDialogValues,
      payment_date: newValue,
    });
  };
  const handleClosePaymentDialog = () => {
    setOpenPaymentDialog(false);
  };
  const handleSubmitPaymentDialog = () => {
    console.log('Form submitted:', paymentDialogValues);
    const user = JSON.parse(localStorage.getItem('user'));
    const req_user_id = user?.uid;
    const user_id = userId;
    if (paymentDialogValues?.payment_id) {
      dispatch(putPaymentDetailsUpdate({ user_id, req_user_id, ...paymentDialogValues })).then(
        () => {
          setLoading(false);
          handleClosePaymentDialog();
        }
      );
      setLoading(true);
    } else {
      dispatch(postPaymentDetailsAdd({ user_id, req_user_id, ...paymentDialogValues })).then(
        (data) => {
          setLoading(false);
          handleClosePaymentDialog();
        }
      );
      setLoading(true);
    }
  };

  const filteredPaymentFields = isNewPayment
    ? PaymentFields.filter((field) => EditableFieldsForAddPayments.includes(field.id))
    : PaymentFields;

  const handleOrderClick = (orderId) => {
    console.log('handle Order Click ', orderId);
    const index = usersSearchResult?.payments.findIndex(
      (payment) => payment.payment_id === orderId
    );
    if (index !== -1) {
      const selectedPayment = usersSearchResult.payments[index];
      console.log('selected payment for edit ', selectedPayment);
      setPaymentDialogValues(selectedPayment);
      setIsNewPayment(false);
      setOpenPaymentDialog(true);
    } else {
      console.log('Selected payment not exist in user search resulst');
    }
  };

  const handlePropertyClick = (propertyId) => {
    console.log('so see the what is inside of the propertyId:', propertyId);
    const newWindow = window.open(`/property/${propertyId}`, '_blank');
    if (newWindow) {
      newWindow.focus();
    } else {
      console.error('Unable to open new window/tab');
    }
  };

  const PropertyColumns = [
    {
      id: 'property_id',
      label: 'Property ID',
      minWidth: 100,
      align: 'center',
      render: (item) => (
        <Button
          component={Link}
          // style={{ color: "blue", textDecoration: "underline", background: "none" }}
          to={`/property/${item.property_id}`}
          rel="noopener noreferrer"
          onClick={() => handlePropertyClick(item.property_id)}
        >
          {item.property_id}
        </Button>
      ),
    },
    { id: 'user_id', label: 'User ID', minWidth: 100, align: 'center' },
    { id: 'listing_type', label: 'Listing Type', minWidth: 100, align: 'center' },
    { id: 'p_type', label: 'Property Type', minWidth: 100, align: 'center' },
    { id: 'area', label: 'Area', minWidth: 100, align: 'center' },
    { id: 'unit', label: 'Unit', minWidth: 100, align: 'center' },
    { id: 'price', label: 'Price', minWidth: 100, align: 'center' },
    { id: 'dimensions', label: 'Dimensions', minWidth: 100, align: 'center' },
    { id: 'direction', label: 'Direction', minWidth: 100, align: 'center' },
    { id: 'est_year', label: 'Est. Year', minWidth: 100, align: 'center' },
    { id: 'latitude', label: 'Latitude', minWidth: 100, align: 'center' },
    { id: 'longitude', label: 'Longitude', minWidth: 100, align: 'center' },
    { id: 'state', label: 'State', minWidth: 100, align: 'center' },
    { id: 'district', label: 'District', minWidth: 100, align: 'center' },
    { id: 'village', label: 'Village', minWidth: 100, align: 'center' },
    { id: 'landmark', label: 'Landmark', minWidth: 100, align: 'center' },
    { id: 'ad_info', label: 'Ad Info', minWidth: 100, align: 'center' },
    { id: 'developments', label: 'Developments', minWidth: 100, align: 'center' },
    { id: 'med_name', label: 'Mediator Name', minWidth: 100, align: 'center' },
    { id: 'med_num1', label: 'Mediator Number 1', minWidth: 100, align: 'center' },
    { id: 'med_num2', label: 'Mediator Number 2', minWidth: 100, align: 'center' },
    { id: 'own_name', label: 'Owner Name', minWidth: 100, align: 'center' },
    { id: 'own_num1', label: 'Owner Number 1', minWidth: 100, align: 'center' },
    { id: 'own_num2', label: 'Owner Number 2', minWidth: 100, align: 'center' },
    { id: 'docfile', label: 'Document File', minWidth: 100, align: 'center' },
    { id: 'rera_status', label: 'RERA Status', minWidth: 100, align: 'center' },
    { id: 'lift', label: 'Lift', minWidth: 100, align: 'center' },
    { id: 'furnished', label: 'Furnished', minWidth: 100, align: 'center' },
    { id: 'bound_wall', label: 'Boundary Wall', minWidth: 100, align: 'center' },
    { id: 'num_open_sides', label: 'Number of Open Sides', minWidth: 100, align: 'center' },
    { id: 'loan_eligible', label: 'Loan Eligible', minWidth: 100, align: 'center' },
    { id: 'approved_by', label: 'Approved By', minWidth: 100, align: 'center' },
    { id: 'survey_number', label: 'Survey Number', minWidth: 100, align: 'center' },
    { id: 'document_number', label: 'Document Number', minWidth: 100, align: 'center' },
    { id: 'disputes', label: 'Disputes', minWidth: 100, align: 'center' },
    { id: 'property_name', label: 'Property Name', minWidth: 100, align: 'center' },
    { id: 'government_price', label: 'Government Price', minWidth: 100, align: 'center' },
    { id: 'register_location', label: 'Register Location', minWidth: 100, align: 'center' },
    { id: 'parking', label: 'Parking', minWidth: 100, align: 'center' },
    { id: 'p_created_on', label: 'Created On', minWidth: 100, align: 'center' },
    { id: 'p_updated_on', label: 'Updated On', minWidth: 100, align: 'center' },
    { id: 'updated_by', label: 'Updated By', minWidth: 100, align: 'center' },
    { id: 'property_status', label: 'Property Status', minWidth: 100, align: 'center' },
    { id: 'verification_status', label: 'Verification', minWidth: 100, align: 'center' },
    { id: 'verifier_comments', label: 'VerifierComments', minWidth: 100, align: 'center' },
    { id: 'is_property_notified', label: 'PropertyNotified', minWidth: 100, align: 'center' },
  ];

  const handleRoleChange = (event) => {
    setRole(event.target.value);
  };

  const handlePlanTypeUpdate = (event) => {
    setPlanType(event.target.value);
  };

  const handleCommentsChange = (event) => {
    setComments(event.target.value);
  };

  const handlePaidTypeChange = (event) => {
    setPaymentStatus(event.target.value);
  };
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handlePaidTypeUpdate = (event) => {
    setPlanType(event.target.value);
  };

  const { profile, properties, interested_areas, payments } = usersSearchResult;

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    const req_user_id = user?.uid;

    if (req_user_id) {
      dispatch(getUserProfileOnSearch({ user_id: userId, req_user_id })).then((response) => {
        console.log(response);
      });
    }
  }, [userId, dispatch]);

  console.log('userData this is issue of the code data  ', userData);
  console.log('userDataTemp ', userDataTemp);

  const handleBackClick = () => {
    navigate('/manage/users');
  };

  /* This is Handle ADD Payment Details Function */
  const handleAddNewPayment = () => {
    setPaymentDialogValues({
      payment_id: '',
      transaction_id: '',
      order_id: '',
      subscription_plan_type: '',
      payment_status: '',
      payment_gateway: '',
      payment_date: '',
      comments: '',
      active_notifications: '',
    });
    setIsNewPayment(true);
    setOpenPaymentDialog(true);
  };

  // const handleAddNewPayment = () => {
  //   setOpenPaymentDialog(true);

  // };

  const handleUpdatePaymentDetails = () => {
    setIsNewPayment(false);
    const user = JSON.parse(localStorage.getItem('user'));
    const req_user_id = user?.uid;

    const UpdatePaymentDetailsData = {
      user_id: userId,
      req_user_id,
      payment_status: PaymentStatus,
      subscription_plan_type: planType,
      order_id: OrderId,
    };
    dispatch(putPaymentDetailsUpdate(UpdatePaymentDetailsData)).then(() => {
      setLoading(false);
    });
    setLoading(true);
  };

  const handleSaveChanges = async () => {
    setLoading(true);
    const user = JSON.parse(localStorage.getItem('user'));
    const req_user_id = user?.uid;

    const updatedData = {
      user_id: userId,
      req_user_id,
      role,
      planType,
      // paymentStatus,
      comments,
    };

    try {
      await dispatch(getUserProfileOnSearch({ user_id: userId, req_user_id, updatedData }));
      dispatch(getUserProfileOnSearch({ user_id: userId, req_user_id })).then((response) => {
        console.log(response);
        setLoading(false);
      });
    } catch (error) {
      console.error('Failed to save changes:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div
        style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}
      >
        <CircularProgress />
      </div>
    );
  }

  return (
    <motion.div className="w-full">
      {GetBackButton('../', 'Back To Previous Page')}
      <Tabs
        value={value}
        onChange={handleChange}
        variant="scrollable"
        scrollButtons="auto"
        indicatorColor="secondary"
        textColor="secondary"
        color="primary"
        classes={{ root: 'w-full h-64 border-b-1' }}
        sx={{margin: 'auto',
          alignItems: 'center',
          alignContent: 'center',
        }}
      >
        <Tab label="User Details" />
        <Tab label="Properties" />
        <Tab label="Intersted Areas" />
        <Tab label="Payment Details" />
        {/* <Tab label="Profile Update" sx={{minWidth: 120,margin:'0 20px'}}/> */}
        <Tab label="Profile Update" />
        <Tab label="Payment " />
        <Tab label="Profile Update" />
      </Tabs>

      <Container maxWidth="lg" style={{ marginTop: '45px' }}>
        {value === 1 && (
          <div>
            {/* <Paper elevation={12} style={{ padding: 50, minHeight: 1000 }}> */}
            <Typography
              variant="h6"
              component="h3"
              gutterBottom
              align="left"
              sx={{ minWidth: 0, margin: '25px 0.1px' }}
            >
              Property Details
            </Typography>

            {console.log('properties Data :', properties)}
            {properties && properties.length > 0 ? (
              <>
                {/* <Property/> */}
                <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                  <TableContainer sx={{ maxHeight: 440 }}>
                    <Table stickyHeader aria-label="sticky table">
                      <TableHead>
                        <TableRow>
                          {PropertyColumns.map((column) => (
                            <TableCell
                              key={column.id}
                              align={column.align}
                              style={{ minWidth: column.minWidth }}
                            >
                              {column.label}
                            </TableCell>
                          ))}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {properties.map((row, index) => (
                          <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                            {PropertyColumns.map((column) => {
                              const value = row[column.id];
                              return (
                                <TableCell key={column.id} align={column.align}>
                                  {column.render ? column.render(row) : value}
                                </TableCell>
                              );
                            })}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Paper>
              </>
            ) : (
              <Typography variant="body1">No properties available</Typography>
            )}
            {/* </Paper> */}
          </div>
        )}
        {value === 0 && (
          <div>
            <Paper elevation={7} style={{ padding: 20, minHeight: 600 }}>
              <Typography
                variant="h6"
                component="h3"
                gutterBottom
                align="left"
                sx={{ minWidth: 0, margin: '25px 0.1px' }}
              >
                User Profile Details
              </Typography>
              <Grid container spacing={12}>
                <Grid item xs={4}>
                  <Typography variant="body1">
                    <strong>ID: </strong>
                    {userId}
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="body1">
                    <strong>Name: </strong>
                    {profile?.name || ''}
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="body1">
                    <strong>Email: </strong>
                    {profile?.email}
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="body1">
                    <strong>Address: </strong>
                    {profile?.address}
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="body1">
                    <strong>Phone Number 1: </strong>
                    {profile?.phone_num_1}
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="body1">
                    <strong>Phone Number 2: </strong>
                    {profile?.phone_num_2}
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="body1">
                    <strong>Comments: </strong>
                    {profile?.comments}
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="body1">
                    <strong>Requirements: </strong>
                    {profile?.requirements}
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="body1">
                    <strong>Role: </strong>
                    {profile?.role}
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="body1">
                    <strong>Notifications: </strong>
                    {profile?.active_notifications}
                  </Typography>
                </Grid>
              </Grid>
            </Paper>
          </div>
        )}

        {value === 2 && (
          <div>
            <Paper elevation={7} style={{ padding: 20, minHeight: 600 }}>
              <Typography
                variant="h6"
                component="h3"
                gutterBottom
                align="left"
                sx={{ minWidth: 0, margin: '25px 0.1px' }}
              >
                Intersted Areas
              </Typography>
              <MySubscriptions
                userid={userId}
                isAdmin={isAdmin}
                subscriptions={manageUserSubscription}
              />
            </Paper>
          </div>
        )}

        {value === 3 && (
          <div>
            <Paper elevation={7} style={{ padding: 20, minHeight: 600 }}>
              <Typography
                variant="h6"
                component="h3"
                gutterBottom
                align="left"
                sx={{ minWidth: 0, margin: '25px 0.1px' }}
              >
                Payment Details
              </Typography>
              <Button
                onClick={handleAddNewPayment}
                sx={{
                  borderRadius: '8px',
                  padding: '7px 15px',
                  backgroundColor: '#4ea944',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: '#0d7e00',
                  },
                }}
              >
                Add New Payment
              </Button>
              <Link onClick={handleUpdatePaymentDetails}></Link>
              {payments && payments.length > 0 ? (
                <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                  <TableContainer sx={{ maxHeight: 440 }}>
                    <Table stickyHeader aria-label="sticky table">
                      <TableHead>
                        <TableRow>
                          {PaymentFields.map((column) => (
                            <TableCell
                              key={column.id}
                              align={column.align}
                              style={{ minWidth: column.minWidth }}
                            >
                              {column.label}
                            </TableCell>
                          ))}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {payments
                          .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                          .map((row, index) => {
                            return (
                              <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                                {PaymentFields.map((column) => {
                                  const value = row[column.id];
                                  return column.id === 'payment_id' ? (
                                    <TableCell
                                      key={column.id}
                                      align={column.align}
                                      onClick={() => handleOrderClick(value)}
                                      style={{ cursor: 'pointer' }}
                                    >
                                      {value}
                                    </TableCell>
                                  ) : (
                                    <TableCell key={column.id} align={column.align}>
                                      {value}
                                    </TableCell>
                                  );
                                })}
                              </TableRow>
                            );
                          })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Paper>
              ) : (
                <Typography variant="body1" align="center" mt={2}>
                  No payment data found
                </Typography>
              )}
            </Paper>
          </div>
        )}

        {value === 5 && (
          <div>
            <Paper elevation={7} style={{ padding: 20, minHeight: 600 }}>
              <Typography
                variant="h6"
                component="h3"
                gutterBottom
                align="left"
                sx={{ minWidth: 0, margin: '25px 0.1px' }}
              >
                Profile Update
              </Typography>
              <Grid container spacing={6}>
                <Grid item xs={4}>
                  <Typography variant="body1">
                    <strong>Requirements: </strong>
                    {userData?.id || ''}
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="body1">
                    {' '}
                    <strong>Name: </strong>
                    {userData?.name || ''}
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="body1">
                    <strong>Email: </strong>
                    {userData?.email}
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="body1">
                    <strong>Profile Verification: </strong>
                    {userData?.address}
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="body1">
                    <strong>Total Assets Value: </strong>
                    {userData?.address}
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="body1">
                    <strong>Comments On Assets: </strong>
                    {payments.length > 0 ? payments[0].Payment_status : 'Null'}
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="body1">
                    <strong>Role: </strong>
                    {profile?.role}
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="body1">
                    <strong>Plan Type: </strong>
                    {payments.length > 0 ? payments[0].subscription_plan_type : 'No Plan Type'}
                  </Typography>
                </Grid>

                <Grid item xs={4}>
                  <Typography variant="body1">
                    <strong>Current Plan End: </strong>

                    {profile?.comments}
                  </Typography>
                </Grid>
              </Grid>
              <Grid item xs={4}>
                <Box sx={{ minWidth: 120 }}>
                  <FormControl fullWidth margin="normal" size="medium">
                    <InputLabel id="demo-simple-select-label">Role</InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={role}
                      label="Role"
                      // defaultValue={userData.role}
                      onChange={handleRoleChange}
                    >
                      <MenuItem value="admin">Admin</MenuItem>
                      <MenuItem value="staff">Staff</MenuItem>
                      <MenuItem value="user">User</MenuItem>
                    </Select>
                  </FormControl>
                </Box>

                <Box
                  sx={{
                    width: 1500,
                    maxWidth: '100%',
                  }}
                >
                  <FormControl fullWidth margin="normal" size="medium">
                    <TextField
                      fullWidth
                      label="Comments"
                      id="comments"
                      multiline
                      minRows={1}
                      maxRows={10}
                      variant="outlined"
                      value={comments}
                      defaultValue={profile?.comments}
                      onChange={handleCommentsChange}
                    />
                  </FormControl>
                </Box>

                <Button
                  varient="contained"
                  onClick={handleSaveChanges}
                  style={{ backgroundColor: 'orange', color: 'white' }}
                >
                  Save Changes
                </Button>
              </Grid>
            </Paper>
          </div>
        )}
        <>
          <Dialog
            open={openPaymentDialog}
            onClose={handleClosePaymentDialog}
            fullWidth
            maxWidth="md"
          >
            <DialogTitle>Payment Form</DialogTitle>
            <DialogContent>
              <DialogContentText>Please fill out the following fields:</DialogContentText>
              <Grid container spacing={2} sx={{ mt: 2 }}>
                {filteredPaymentFields.map((field) => (
                  <Grid item xs={12} sm={6} key={field.id}>
                    {field.id === 'subscription_plan_type' ? (
                      <FormControl fullWidth margin="normal">
                        <InputLabel>{field.label}</InputLabel>
                        <Select
                          name={field.id}
                          label="Plan Type"
                          value={paymentDialogValues[field.id]}
                          onChange={handleChangeInPaymentDialog}
                          disabled={
                            isNewPayment && !EditableFieldsForAddPayments.includes(field.id)
                          }
                        >
                          <MenuItem value="classic">Classic</MenuItem>
                          <MenuItem value="premium">Premium</MenuItem>
                        </Select>
                      </FormControl>
                    ) : field.id === 'Payment_status' ? (
                      <FormControl fullWidth margin="normal">
                        <InputLabel>{field.label}</InputLabel>
                        <Select
                          name={field.id}
                          label={field.id}
                          value={paymentDialogValues[field.id]}
                          onChange={handleChangeInPaymentDialog}
                          disabled={
                            isNewPayment && !EditableFieldsForAddPayments.includes(field.id)
                          }
                        >
                          <MenuItem value="unpaid">Unpaid</MenuItem>
                          <MenuItem value="paid">Paid</MenuItem>
                        </Select>
                      </FormControl>
                    ) : field.id === 'payment_gateway' ? (
                      <FormControl fullWidth margin="normal">
                        <InputLabel>{field.label}</InputLabel>
                        <Select
                          name={field.id}
                          label={field.id}
                          value={paymentDialogValues[field.id]}
                          onChange={handleChangeInPaymentDialog}
                          disabled={
                            isNewPayment && !EditableFieldsForAddPayments.includes(field.id)
                          }
                        >
                          <MenuItem value="payPal">PayPal</MenuItem>
                          <MenuItem value="paytm">Paytm</MenuItem>
                          <MenuItem value="phonepay">Phone Pay</MenuItem>
                          <MenuItem value="googlepay">Google Pay</MenuItem>
                          <MenuItem value="upi"> Upi </MenuItem>
                        </Select>
                      </FormControl>
                    ) : field.id === 'payment_date' ? (
                      <FormControl fullWidth margin="normal">
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          {/* <InputLabel>{field.label}</InputLabel> */}
                          {/* <TextField
                    name={field.id}
                    label="Payment Date"
                
                    value={paymentDialogValues[field.id]}
                    onChange={handleChangeInPaymentDialog}
                    disabled={isNewPayment && !EditableFieldsForAddPayments.includes(field.id)}
                  > */}

                          <DateTimePicker
                            label="Payment Date"
                            value={paymentDialogValues[field.id]}
                            onChange={(newValue) =>
                              handleDateChangeInPaymentDialog(field.id, newValue)
                            }
                            renderInput={(params) => <TextField {...params} />}
                            views={['year', 'month', 'day', 'hours', 'minutes', 'seconds']}
                            // inputFormat="YYYY/MM/DD HH:mm:ss"
                            inputFormat="YYYY-MM-DD HH:mm:ss"
                            ampm={false}
                            // disabled={!isNewPayment && !EditableFieldsForUpdate.includes(field.id)}
                          />
                        </LocalizationProvider>
                      </FormControl>
                    ) : field.id === 'active_notifications' ? (
                      <FormControl fullWidth margin="normal">
                        {/* <InputLabel>{field.label}</InputLabel> */}
                        <TextField
                          fullWidth
                          // variant="outlined"
                          name={field.id}
                          label={field.label}
                          type="number" // Ensure it's an integer input
                          value={paymentDialogValues[field.id]}
                          onChange={handleChangeInPaymentDialog}
                          disabled={
                            isNewPayment && !EditableFieldsForAddPayments.includes(field.id)
                          }
                        />
                      </FormControl>
                    ) : (
                      <TextField
                        fullWidth
                        variant="outlined"
                        name={field.id}
                        label={field.label}
                        value={paymentDialogValues[field.id]}
                        onChange={handleChangeInPaymentDialog}
                        margin="normal"
                        disabled={isNewPayment && !EditableFieldsForAddPayments.includes(field.id)}
                      />
                    )}
                  </Grid>
                ))}
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClosePaymentDialog} color="primary">
                Cancel
              </Button>
              <Button onClick={handleSubmitPaymentDialog} color="primary">
                Submit
              </Button>
            </DialogActions>
          </Dialog>
        </>
      </Container>
      {/* </Box> */}
    
    </motion.div>
  );
};

export default ManageUserProfile;
