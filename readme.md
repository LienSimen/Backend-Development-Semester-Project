# Table of Content

* [Reception Management Dashboard](#Reception-Management-Dashboard)
* [Introduction](#introduction)
* [Directory Structure](#Directory-Structure)
* [Installation](#Installation)
* [Usage](#Usage)
* [Modify Code](#Modify-Code)
* [Contact](#Contact)

## Reception Management Dashboard

- Staff member out-of-office logging.
- Deliveries tracking.

## Introduction

A simple dashboard for the receptionist at WeDeliverTECH™ to keep track of staff members and delivery drivers

## Directory Structure

- `Documentation`:
  - `jira.pdf`: Contains the reflection report
- `Web Application`: Contains all the code for the web application.
  - `index.html`: The main HTML file containing the structure of the web application.
  - `js/`:
    - `wdt_app.js`: The main JavaScript file containing the application logic.
  - `css/`:
    - `styles.css`: The main CSS files for styling the application.
  - `assets/`:
    - `Company logo.png`: Contains the company logo.

## Installation

To install and run the web application locally, follow these steps:

1. Clone this repository to your local machine.
    
    git clone https://github.com/dragelol/simen_lien_sp1.git
    

2. Navigate to the project directory.

    cd "web application"

3. Open the `index.html` file in your preferred web browser.


## Usage 

To use the Staff Table, follow these steps:

1. **Select a staff member**: To select a staff member, simply click on their row in the staff table.

2. **Update staff status**: With a staff member selected, click the "Out" button to update their status to "Out." A prompt will appear asking for the duration of their absence in minutes. Enter the duration and click "OK." With a staff member selected, click the "In" button to update their status to "In" and clear their "Out Time", "Duration" and "Expected Return Time" cells.

3. **View expected return time**: The application will automatically calculate the staff member's expected return time based on the duration of their absence. This information will be displayed in the "Expected Return" column of the staff table.

4. **Receive notifications**: If a staff member is late, a toast notification will appear at the top of the screen with the staff member's name, picture, and the number of minutes they've been late.

To use the Shedule Delivery and the Delivery Board, follow these steps:

1. **Adding a delivery driver**: Choose a vehicle in the dropdown menu and fill in the information about the driver. Clicking the 'Add' button will add the driver to the Delivery Board.

2. **Clearing a delivery driver**: To clear a delivery driver, simply click their row in the delivery board, and click the "Clear" button.  A prompt will appear asking for confirmation, clicking "Ok" will remove the selected row from the Delivery Board. Clicking "Cancel" will take you back to the dashboard.

3. **Receive notifications**: If a delivery driver is late, a toast notification will appear at the top of the screen with the delivery driver's name, surname, delivery address, phone number, and their estimated return time.

**Clock**: A clock in the bottom display's time in the format; Day/Month/Year Hour:Minute:Second and is updated every second.

**Navbar**: Clicking dashboard on the Navbar directs you to the dashboard. The other sub menus are not functional.

## Modify Code

**Replacing API**: To replace the API-generated staff members with your own hardcoded staff members, follow these steps:

1. Remove or comment out the code that fetches data from the API and populates the table. It's enough to comment out $(document).ready(staffUserGet).

2. Modify the HTML for the table body (<tbody id="staff-table">) to include the hardcoded staff members, example below.

```<tbody id="staff-table">
  <tr>
    <td class="custom-td"><img src="path/to/image1.jpg" alt="Staff Member 1"></td>
    <td class="custom-td">John</td>
    <td class="custom-td">Doe</td>
    <td class="custom-td">john.doe@example.com</td>
    <td class="custom-td status">In</td>
    <td class="custom-td out-time"></td>
    <td class="custom-td duration"></td>
    <td class="custom-td expected-return"></td>
  </tr>
  <tr>
    <td class="custom-td"><img src="path/to/image2.jpg" alt="Staff Member 2"></td>
    <td class="custom-td">Jane</td>
    <td class="custom-td">Smith</td>
    <td class="custom-td">jane.smith@example.com</td>
    <td class="custom-td status">In</td>
    <td class="custom-td out-time"></td>
    <td class="custom-td duration"></td>
    <td class="custom-td expected-return"></td>
  </tr>
</tbody>

**Adding New Vehicles**: To add new vehicles to the Schedule Delivery board, follow these steps:

1. Add an if else statement in the addDelivery function, example below adds a scooter and a truck

 if (vehicleType === 'motorcycle') {
    vehicleIcon = '<i class="bi bi-bicycle"></i>';
  } else if (vehicleType === 'truck') {
    vehicleIcon = '<i class="bi bi-truck"></i>';
  } else if (vehicleType === 'scooter') {
    vehicleIcon = '<i class="bi bi-scooter"></i>';
  } else {
    vehicleIcon = '<i class="bi bi-car-front"></i>';
  }

Icons can be found at https://icons.getbootstrap.com/. Motorcycle currently has bicycle icon as I found no motorcycle icon.

2. Modify the validateDelivery function to include your new option, example below adds a scooter and a truck.

```const vehicleRegex = /^(car|truck|motorcycle|scooter)$/i;
  if (!vehicleRegex.test(vehicle)) {
      alert('Vehicle type must be either "car", "truck", "scooter" or "motorcycle".');
      return false;
}

**Change from Input to dropdown in Schedule Delivery**: To change the vehicle input field to a dropdown menu, follow the steps below.

1. Replace the HTML code;
<td><input type="text" name="vehicle"></td>

Change it to:

```<td><select name="vehicle">
      <option value="car">Car</option>
      <option value="motorcycle">Motorcycle</option>
      <option value="truck">Truck</option>
    </select>
</td>

2. Replace the JavaScript codes in the createDeliveryDriver and validateDelivery;

const vehicle = $('input[name="vehicle"]').val();

Change it to:

const vehicle = $('select[name="vehicle"]').val();

**Navbar implementations**

Navbar is set up so you can replace the '#' with links, example below.

```<ul class="dropdown-menu">
    <li><a class="navbar-sub-menu-item" href="https://www.google.com/">Search</a></li>
    <li><a class="navbar-sub-menu-item" href="https://www.youtube.com/">Add</a></li>
    <li><a class="navbar-sub-menu-item" href="https://www.w3schools.com/">Remove</a></li>
</ul>

## Contact

Simen Lien - simlie51727@stud.noroff.no - (https://github.com/dragelol)
