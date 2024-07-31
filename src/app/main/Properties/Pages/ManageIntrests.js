import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { TextField, MenuItem, Button, Box, Grid, FormControl, FormControlLabel, RadioGroup, Radio, Typography } from '@mui/material';

const ManageInterests = () => {
  const { control: controlSearch, handleSubmit: handleSubmitSearch, formState: { errors: errorsSearch } } = useForm();
  const { control: controlAdd, handleSubmit: handleSubmitAdd, formState: { errors: errorsAdd } } = useForm();

  const onSubmitSearch = (data) => {
    console.log("Search Interests Data:", data);
    // Handle search form submission logic here
  };

  const onSubmitAdd = (data) => {
    console.log("Add Interest Data:", data);
    // Handle add form submission logic here
  };

  return (
    <Box sx={{ flexGrow: 1, padding: 2 }}>
      <Grid container spacing={2}>
        {/* Search Interests Form */}
        <Grid item xs={12} md={6}>
          <Box
            sx={{
              padding: 2,
              boxShadow: 3,
              borderRadius: 2,
              backgroundColor: 'background.paper',
            }}
          >
            <Typography variant="h6" gutterBottom>
              Search Interests
            </Typography>
            <form onSubmit={handleSubmitSearch(onSubmitSearch)}>
              <Box mb={2}>
                <Controller
                  name="fromDate"
                  control={controlSearch}
                  defaultValue=""
                  rules={{ required: "From date is required" }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="From Date"
                      type="date"
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                      error={!!errorsSearch.fromDate}
                      helperText={errorsSearch.fromDate ? errorsSearch.fromDate.message : ''}
                    />
                  )}
                />
              </Box>

              <Box mb={2}>
                <Controller
                  name="location"
                  control={controlSearch}
                  defaultValue=""
                  rules={{ required: "Location is required" }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Location"
                      fullWidth
                      error={!!errorsSearch.location}
                      helperText={errorsSearch.location ? errorsSearch.location.message : ''}
                    />
                  )}
                />
              </Box>

              <Box mb={2}>
                <Controller
                  name="propertyType"
                  control={controlSearch}
                  defaultValue=""
                  rules={{ required: "Property type is required" }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      select
                      label="Property Type"
                      fullWidth
                      error={!!errorsSearch.propertyType}
                      helperText={errorsSearch.propertyType ? errorsSearch.propertyType.message : ''}
                    >
                      <MenuItem value="">Select a property type</MenuItem>
                      <MenuItem value="apartment">Apartment</MenuItem>
                      <MenuItem value="house">House</MenuItem>
                      <MenuItem value="condo">Condo</MenuItem>
                      <MenuItem value="studio">Studio</MenuItem>
                    </TextField>
                  )}
                />
              </Box>

              <Button type="submit" variant="contained" color="primary">
                Search
              </Button>
            </form>
          </Box>
        </Grid>

        {/* Add Interest Form */}
        <Grid item xs={12} md={6}>
          <Box
            sx={{
              padding: 2,
              boxShadow: 3,
              borderRadius: 2,
              backgroundColor: 'background.paper',
            }}
          >
            <Typography variant="h6" gutterBottom>
              Add Interest
            </Typography>
            <form onSubmit={handleSubmitAdd(onSubmitAdd)}>
              <Box mb={2}>
                <Controller
                  name="name"
                  control={controlAdd}
                  defaultValue=""
                  rules={{ required: "Name is required" }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Name"
                      fullWidth
                      error={!!errorsAdd.name}
                      helperText={errorsAdd.name ? errorsAdd.name.message : ''}
                    />
                  )}
                />
              </Box>

              <Box mb={2}>
                <Controller
                  name="phoneNumber"
                  control={controlAdd}
                  defaultValue=""
                  rules={{ required: "Phone number is required" }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Phone Number"
                      fullWidth
                      error={!!errorsAdd.phoneNumber}
                      helperText={errorsAdd.phoneNumber ? errorsAdd.phoneNumber.message : ''}
                    />
                  )}
                />
              </Box>

              <Box mb={2}>
                <Controller
                  name="location"
                  control={controlAdd}
                  defaultValue=""
                  rules={{ required: "Location is required" }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Location"
                      fullWidth
                      error={!!errorsAdd.location}
                      helperText={errorsAdd.location ? errorsAdd.location.message : ''}
                    />
                  )}
                />
              </Box>

              <Box mb={2}>
                <Controller
                  name="propertyType"
                  control={controlAdd}
                  defaultValue=""
                  rules={{ required: "Property type is required" }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      select
                      label="Property Type"
                      fullWidth
                      error={!!errorsAdd.propertyType}
                      helperText={errorsAdd.propertyType ? errorsAdd.propertyType.message : ''}
                    >
                      <MenuItem value="">Select a property type</MenuItem>
                      <MenuItem value="apartment">Apartment</MenuItem>
                      <MenuItem value="house">House</MenuItem>
                      <MenuItem value="condo">Condo</MenuItem>
                      <MenuItem value="studio">Studio</MenuItem>
                    </TextField>
                  )}
                />
              </Box>

              <Box mb={2}>
                <Controller
                  name="createdOn"
                  control={controlAdd}
                  defaultValue=""
                  rules={{ required: "Created on date is required" }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Created On"
                      type="date"
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                      error={!!errorsAdd.createdOn}
                      helperText={errorsAdd.createdOn ? errorsAdd.createdOn.message : ''}
                    />
                  )}
                />
              </Box>

              <Box mb={2}>
                <FormControl component="fieldset" error={!!errorsAdd.status}>
                  <Controller
                    name="status"
                    control={controlAdd}
                    defaultValue="active"
                    render={({ field }) => (
                      <RadioGroup {...field}>
                        <FormControlLabel value="active" control={<Radio />} label="Active" />
                        <FormControlLabel value="inactive" control={<Radio />} label="Inactive" />
                      </RadioGroup>
                    )}
                  />
                  {errorsAdd.status && <Typography color="error">{errorsAdd.status.message}</Typography>}
                </FormControl>
              </Box>

              <Button type="submit" variant="contained" color="primary">
                Add Interest
              </Button>
            </form>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ManageInterests;

