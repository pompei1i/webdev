document.addEventListener('DOMContentLoaded', () => {
    // 1. scroll reveal logic
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

    // 2. form logic
    const appointmentForm = document.getElementById('appointmentForm');
    const successState = document.getElementById('successState');

    if (appointmentForm) {
        appointmentForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // send letter
            console.log("Form data captured:", {
                name: document.getElementById('firstName').value + " " + document.getElementById('lastName').value,
                email: document.getElementById('email').value,
                request: document.getElementById('message').value
            });

            // hide the form and show the message right there on the section
            appointmentForm.classList.add('hidden');
            successState.classList.remove('hidden');
        });
    }
});

// send another request button
function resetForm() {
    const appointmentForm = document.getElementById('appointmentForm');
    const successState = document.getElementById('successState');
    
    successState.classList.add('hidden');
    appointmentForm.classList.remove('hidden');
    appointmentForm.reset();
}