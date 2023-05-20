class Employee {
	constructor(name, surname) {
		this.name = name;
		this.surname = surname;
	}
}

class StaffMember extends Employee {
	constructor(name, surname, picture, email, status, outTime, duration, expectedReturn) {
		super(name, surname);
		this.picture = picture;
		this.email = email;
		this.status = status;
		this.outTime = outTime;
		this.duration = duration;
		this.expectedReturn = expectedReturn;
	}

	staffMemberIsLate() {
		const now = new Date();
		const expectedReturnDate = new Date(this.expectedReturn);
		if (now > expectedReturnDate) {
			this.timeElapsed = Math.floor((now - expectedReturnDate) / 60000);
			return true;
		} else {
			this.timeElapsed = 0;
			return false;
		}
	}
}

class DeliveryDriver extends Employee {
	constructor(name, surname, vehicle, telephone, deliveryAddress, returnTime) {
		super(name, surname);
		this.vehicle = vehicle;
		this.telephone = telephone;
		this.deliveryAddress = deliveryAddress;
		this.returnTime = returnTime;
	}

	deliveryDriverIsLate() {
		const now = new Date();
		const [hours, minutes] = this.returnTime.split(':');
		const returnTimeDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes);

		return now > returnTimeDate;
	}
}
let staffMembers = []; // Array to store staffMembers

function staffUserGet() {
	const numberOfStaff = 5;
	const apiUrl = `https://randomuser.me/api/?results=${numberOfStaff}&timestamp=${new Date().getTime()}`;

	$.getJSON(apiUrl, function(data) {
		const staffData = data.results;

		staffData.forEach(staffMemberData => {
			const pictureUrl = staffMemberData.picture.thumbnail;
			const name = staffMemberData.name.first;
			const surname = staffMemberData.name.last;
			const email = staffMemberData.email;
			const status = "In";
			const outTime = null;
			const duration = null;
			const expectedReturn = null;

			// Create a StaffMember object
			const staffMember = new StaffMember(name, surname, pictureUrl, email, status, outTime, duration, expectedReturn);

			// Add the new StaffMember to the staffMembers array
			staffMembers.push(staffMember);

			// Populate the table with the new StaffMember object
			populateTable(staffMember);
		});
	});
}

function populateTable(staffMember) {
	const row = $(`<tr>
        		<td class="custom-td"><img src="${staffMember.picture}" alt="${staffMember.name} ${staffMember.surname}'s picture"></td>
       			<td class="custom-td">${staffMember.name}</td>
        		<td class="custom-td">${staffMember.surname}</td>
        		<td class="custom-td">${staffMember.email}</td>
        		<td class="custom-td status">In</td>
        		<td class="custom-td out-time"></td>
        		<td class="custom-td duration"></td>
        		<td class="custom-td expected-return"></td>
    		</tr>`);

	$('#staff-table').append(row);
}

// Call the function when the page loads
$(document).ready(function() {
	staffUserGet();
	setInterval(digitalClock, 1000);
});

// Add event listener to "Out" button
$(document).on('click', '.out-button', function() {
	// Get the selected row
	const row = $('#staff-table tr.selected');
	// Make sure a row is selected
	if (row.length === 0) {
		showError('Please select a staff member by clicking on their row in the table.');
		return;
	}
	staffOut(row);
});
// Display an error message in a modal.
function showError(message) {
	$('#modal-body').text(message);
	$('#myModal').modal('show');
}

// Display a confirmation dialog in a modal with callback for confirmation.
function showConfirmation(message, onConfirm) {
	$('#confirmModal .modal-body').text(message);
	$('#confirmModal .confirm-btn').off('click').on('click', onConfirm);
	$('#confirmModal').modal('show');
}
// Declare two Map to store timeoutIds as a global variable
let timeoutIds = new Map();
let intervalIds = new Map();

function staffOut(row) {
	// Retrieve staff member details from the selected row

	const email = row.find('td:nth-child(4)').text();

	// Find the StaffMember with the matching email
	const staffMember = staffMembers.find(member => member.email === email);
	if (!staffMember) {
		showError('Staff member not found.');
		return;
	}

	// Update the staff member's status to "Out"
	staffMember.status = 'Out';
	row.find('.status').text(staffMember.status);

	// Record the current time as the staff member's "Out Time"
	const outTime = new Date();
	staffMember.outTime = outTime;
	row.find('.out-time').text(outTime.toLocaleTimeString());

	// Get the duration of the staff member's absence in minutes
	const duration = prompt('Enter duration of absence in minutes:');
	// If the user clicked "Cancel" or didn't enter any value, don't fill in the table
	if (duration === null || duration.trim() === '') {
		// Reset the status to "In"
		staffMember.status = 'In';
		row.find('.status').text(staffMember.status);
		// Clear the out time
		row.find('.out-time').text('');
		return;
	}
	// Convert the duration to an integer representing minutes
	const durationMinutes = parseInt(duration);

	// Calculate and display the duration of their absence in hours and minutes
	const durationHours = Math.floor(durationMinutes / 60);
	const durationRemainderMinutes = durationMinutes % 60;
	staffMember.duration = `${durationHours}h ${durationRemainderMinutes}m`;
	row.find('.duration').text(staffMember.duration);

	// Calculate and display the staff member's expected return time
	const expectedReturn = new Date(outTime.getTime() + durationMinutes * 60000);
	staffMember.expectedReturn = expectedReturn;
	row.find('.expected-return').text(expectedReturn.toLocaleTimeString());

	// Calculate the delay until the staff member is expected to return
	const delay = expectedReturn.getTime() - new Date().getTime();

	// Schedule a toast notification to be displayed when the staff member is late
	const timeoutId = setTimeout(function() {
		if (staffMember.staffMemberIsLate()) {
			const message = `${staffMember.name} ${staffMember.surname} has been out-of-office for ${staffMember.duration} minutes.`;
			const toast = `
            <div class="toast" role="alert">
                <div class="toast-header">
                    <img src="${staffMember.picture}" class="rounded me-2" alt="${staffMember.name} ${staffMember.surname}'s picture">
                    <strong class="me-auto">${staffMember.name} ${staffMember.surname}</strong>
                    <small>${staffMember.outTime.toLocaleTimeString()}</small>
                    <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
                </div>
                <div class="toast-body">${message}</div>
            </div>`;
			$('#toast-container').append(toast);
			$('.toast').toast('show');
		}
	}, delay);

	// Store the timeoutId in the timeoutIds Map using the staff member's email as the key
	timeoutIds.set(staffMember.email, timeoutId);
}

// Add event listener to "In" button
$(document).on('click', '.in-button', function() {
	// Get the selected row
	const row = $('#staff-table tr.selected');

	// Make sure a row is selected
	if (row.length === 0) {
		showError('Please select a staff member by clicking on their row in the table.');
		return;
	}
	staffIn(row);
});

function staffIn(row) {
	// Update the staff member's status to "In"
	row.find('.status').text('In');

	// Clear the staff member's "Out Time", "Duration", and "Expected Return Time" cells
	row.find('.out-time, .duration, .expected-return').text('');

	// Get the staff member's email from the row
	const email = row.find('td:nth-child(4)').text();

	// If there's a timeout scheduled for this staff member, clear it
	if (timeoutIds.has(email)) {
		clearTimeout(timeoutIds.get(email));
		timeoutIds.delete(email);
	}

	// Remove all existing toasts from the toast container
	$('#toast-container').empty();
}

function validateDelivery() {
	const vehicle = $('input[name="vehicle"]').val();
	const name = $('input[name="name"]').val();
	const surname = $('input[name="surname"]').val();
	const telephone = $('input[name="telephone"]').val();
	const address = $('input[name="address"]').val();
	const returnTime = $('input[name="return-time"]').val();

	if (!vehicle || !name || !surname || !telephone || !address || !returnTime) {
		showError('Please fill in all fields.');
		return false;
	}

	const vehicleRegex = /^(car|motorcycle)$/i;
	if (!vehicleRegex.test(vehicle)) {
		showError('Vehicle type must be either "car" or "motorcycle".');
		return false;
	}

	const telephoneRegex = /^\d{5,10}$/;
	if (!telephoneRegex.test(telephone)) {
		showError('Please enter a valid telephone number.');
		return false;
	}

	const returnTimeRegex = /^\d{2}:\d{2}$/;
	if (!returnTimeRegex.test(returnTime)) {
		showError('Please enter a valid return time in the format "hh:mm".');
		return false;
	}

	return true;
}

function createDeliveryDriver() {
	return new DeliveryDriver(
		$('input[name="name"]').val(),
		$('input[name="surname"]').val(),
		$('input[name="vehicle"]').val(),
		$('input[name="telephone"]').val(),
		$('input[name="address"]').val(),
		$('input[name="return-time"]').val()
	);
}

// Add a new delivery driver to the delivery board table
function addDelivery(deliveryDriver) {
	// Determine the vehicle icon based on the delivery driver's vehicle type
	const vehicleType = deliveryDriver.vehicle.toLowerCase();
	let vehicleIcon = '';

	// Assign the appropriate vehicle icon based on the vehicle type - Truck added here but not used 
	if (vehicleType === 'motorcycle') {
		vehicleIcon = '<i class="bi bi-bicycle"></i>';
	} else {
		vehicleIcon = '<i class="bi bi-car-front"></i>';
	}

	// Create a new table row with the delivery driver's details
	const newRow = $(`<tr>
      		<td class="custom-td">${vehicleIcon}</td>
      		<td class="custom-td">${deliveryDriver.name}</td>
      		<td class="custom-td">${deliveryDriver.surname}</td>
      		<td class="custom-td">${deliveryDriver.telephone}</td>
     		<td class="custom-td">${deliveryDriver.deliveryAddress}</td>
      		<td class="custom-td">${deliveryDriver.returnTime}</td>
    	</tr>`);
	$('#delivery-board tbody').append(newRow);
	// Schedule the interval and save its ID
	let intervalId = setInterval(function() {
		if (deliveryDriver.deliveryDriverIsLate()) {
			clearInterval(intervalId);
			intervalIds.delete(deliveryDriver.telephone);
			// Display a toast notification
			const message = `${deliveryDriver.name} ${deliveryDriver.surname} is late. Estimated return time: ${deliveryDriver.returnTime}. Delivery address: ${deliveryDriver.deliveryAddress}.`;
			const toast = `
            <div class="toast" role="alert" data-bs-autohide="true" data-bs-delay="15000">
            <div class="toast-header">
            <strong class="me-auto">${deliveryDriver.name} ${deliveryDriver.surname}</strong>
            <medium><i class="bi bi-telephone"></i>${deliveryDriver.telephone}</medium>
            <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
            <div class="toast-body">${message}</div>
            </div>`;
			$('#toast-container').append(toast);
			$('.toast').toast('show');
		}
	}, 1000);

	// Store the intervalId in the intervalIds Map using the driver's telephone as the key
	intervalIds.set(deliveryDriver.telephone, intervalId);
}
// Add event listener to "Add" button in Schedule Delivery table
$(document).ready(function() {
	$('#add-btn').click(function() {
		if (validateDelivery()) {
			const deliveryDriver = createDeliveryDriver();
			addDelivery(deliveryDriver);
			// Clear input field
			$('input[name="vehicle"]').val('');
			$('input[name="name"]').val('');
			$('input[name="surname"]').val('');
			$('input[name="telephone"]').val('');
			$('input[name="address"]').val('');
			$('input[name="return-time"]').val('');
		}
	});

	// Add event listener to "Clear" button in Delivery Board table
	$(document).on('click', '.clear-button', function() {
		// Get the selected row
		const row = $('#delivery-board tr.selected');

		// Ask for confirmation before clearing the row
		showConfirmation('Are you sure you want to remove this row?', function() {
			// Get the driver's telephone from the row
			const telephone = row.find('td:nth-child(4)').text();

			// If there's an interval scheduled for this driver, clear it
			if (intervalIds.has(telephone)) {
				clearInterval(intervalIds.get(telephone));
				intervalIds.delete(telephone);
			}

			// Clear the row
			row.remove();

			// Empty the toast container
			$('#toast-container').empty();

			// Close the modal
			$('#confirmModal').modal('hide');
		});
	});
});

// Add event listener to table rows
$(document).on('click', 'tr', function() {
	// Remove "selected" class from all rows
	$('tr').removeClass('selected');

	// Add "selected" class to clicked row
	$(this).addClass('selected');
});

function digitalClock() {
	const now = new Date();
	const options = {
		year: 'numeric',
		month: '2-digit',
		day: '2-digit'
	};
	const date = now.toLocaleDateString('en-GB', options);
	const time = now.toLocaleTimeString('en-GB');
	const clock = `${date} ${time}`;
	document.getElementById('clock').textContent = clock;
}
