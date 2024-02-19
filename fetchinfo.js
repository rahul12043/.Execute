async function handleFormSubmit() {
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    // const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
  
    // Client-side password validation
    if (password !== confirmPassword) {
        alert('Passwords do not match!');
        return; // Prevent form submission
    }
  
    // Basic input validation (add more as needed)
    if (!name || !email || !password) {
      alert('Please fill in all required fields.');
      return;
    }
  
    try {
      // Server-side validation on the backend would be beneficial here (consider using express-validator)
      const response = await fetch('/createUser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({name, email, password})
      });
  
      if (response.ok) {
        console.log('User created successfully!');
        // Clear the form, show success message, redirect to login page or other appropriate action
      } else {
        console.error('Error creating user:', response.statusText);
        // Handle errors (e.g., display error message to user)
      }
    } catch (error) {
      console.error('Error in fetch:', error);
      // Handle network or other errors
    }
  }
  