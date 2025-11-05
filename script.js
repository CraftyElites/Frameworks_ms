document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
});
const currentUser = localStorage.getItem('currentUser');
const modalContainer = document.querySelector('.modal-container');
const profileDropdown = document.querySelector('.profile-dropdown');
const dropdown = document.querySelector('.dropdown');
const closeDropdown = document.querySelector('.close-dropdown');

const section = document.querySelectorAll('.section');
const dropdownItem = document.querySelectorAll('.dropdown-item');
const editProfileBtn = document.querySelector('.edit-profile');
const editSection = document.querySelector('.section.edit');

const promptLogout = document.querySelector('.logout-item');
const logoutModal = document.querySelector('.modal.logout');
const closeModal = document.querySelectorAll('.close-modal');
const notNow = document.querySelectorAll('.not-now');
const logoutContinue = document.querySelector('.logout-continue');
const userParsed = JSON.parse(currentUser);


function closeAllModal() {
    const modal = document.querySelectorAll('.modal');
    modal.forEach(modal => {
        modal.classList.remove('active');
    });
}

function addActiveSubSection(id) {
    const subSection = document.querySelector(`#${id}`);
    removeActiveSubSection();
    subSection.classList.add('active');
};

function removeActiveSubSection() {
    section.forEach(division => {
        division.classList.remove('active');
    });
}

function setUpPage() {
    if(!currentUser) {
        window.location.href = './login.html';
    } else {
        const profileName = document.querySelector('.profile-name');
        const profileEmail = document.querySelector('.profile-email');
        const profileImage = document.querySelector('.profile-avatar img');
        const profileBio = document.querySelector('.profile-bio');
        const profileTel = document.querySelector('.profile-number');
        const profilePostCount = document.querySelector('.post-count h4');
        const profileFollowers = document.querySelector('.followers-count h4');
        const profileFollowing = document.querySelector('.following-count h4');

        const userParsed = JSON.parse(currentUser);
        profileName.innerHTML = userParsed.name;
        profileEmail.innerHTML = userParsed.email;
        profileImage.src = userParsed.profileImage;
        profileTel.innerHTML = userParsed.number;
        profileBio.innerHTML = userParsed.bio;
        profilePostCount.innerHTML = userParsed.post.length;
        profileFollowers.innerHTML = userParsed.followers;
        profileFollowing.innerHTML = userParsed.following;


        loadFeed();
    }
}

async function loadFeed() {
    const cardFeed = document.querySelector('.main-content');
    const response = await fetch('data.json');
    const data = await response.json(); // parse the JSON here

    const rt = data.filter(actual => actual.id !== userParsed.id);
    console.log('Filtered:', rt)
    
    const cards = rt.map(item =>
        `
            <div class="user-card" id="${item.id}">
                    <div class="card-header">
                        <div class="user-avatar">
                            <img src="${item.profileImage}" alt="image">
                        </div>
                        <div class="user-info">
                            <div class="user-name">
                                <h5>${item.name}</h5>
                            </div>
                            <span class="user-bio">
                               ${item.bio}
                            </span>
                        </div>
                    </div>
                    <div class="card-action">
                        <button class="action-btn">Call</button>
                        <button class="action-btn fill email" value="${item.email}">Email</button>
                    </div>
            </div>
        `
   ).join('');
    
    cardFeed.innerHTML = '';
    cardFeed.innerHTML = cards;
};

function openMailer(address, name) {
    const mailer =  document.querySelector('.mailer');
    if(address && name) {
        const reciever = document.querySelector('.currentMailee');
        reciever.textContent = name;
        const mailSubmit = document.querySelector('.submit-mail');
        mailSubmit.value = address;
        mailSubmit.addEventListener('click', (e) => {
            const emailAddress = e.target.value.trim();
            const subject = document.querySelector('#mailSubject').value;
            const body = document.querySelector('#mailBody').value.trim() + ' ... ' + `Mailer - ${name} (Card Like Vision)`;
            mailer.classList.remove('active');
            submitMail(emailAddress, subject, body);
        });
        mailer.classList.add('active');
    } else {
        mailer.classList.add('active');
        alert('No Content Found!');
    }
}

function submitMail(address, subject, body) {
  const mailtoUrl = `mailto:${encodeURIComponent(address)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  try {
    // Open the default mail client in a new tab or window
    window.open(mailtoUrl, '_blank');
  } catch (error) {
    // Fallback to Gmail if the mailto handler fails (rare)
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(address)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(gmailUrl, '_blank');
  }
}


async function setUpEventListener() {
    profileDropdown.addEventListener('click', () => {
        modalContainer.classList.add('open');
        dropdown.classList.add('active');
    });

    closeDropdown.addEventListener('click', () => {
        modalContainer.classList.remove('open');
        dropdown.classList.remove('active');
    });

    dropdownItem.forEach(item => {
        item.addEventListener('click', (e) => {
            const value = item.getAttribute('value');
            console.log(value);
            addActiveSubSection(value);
            modalContainer.classList.remove('open');
            dropdown.classList.remove('active');
        });
    });
    editProfileBtn.addEventListener('click', () => {
        removeActiveSubSection();
        editSection.classList.add('active');
    });
    
    promptLogout.addEventListener('click', () => {
        modalContainer.classList.add('open');
        dropdown.classList.remove('active');
        logoutModal.classList.add('active');
    });
    closeModal.forEach(cancel => {
        cancel.addEventListener('click', () => {
            modalContainer.classList.remove('open');
            closeAllModal();
            dropdown.classList.remove('active');
        });
    });
    notNow.forEach(cancel => {
        cancel.addEventListener('click', () => {
            modalContainer.classList.remove('open');
            closeAllModal();
            dropdown.classList.remove('active');
        });
    });

    logoutContinue.addEventListener('click', () => {
        localStorage.removeItem('currentUser');
        window.location.href = './login.html';
    }); 
    const response = await fetch('data.json');
    const data = await response.json(); // parse the JSON here
    const emailbtn = document.querySelectorAll('.action-btn');
    emailbtn.forEach(btn => {
  btn.addEventListener('click', (e) => {
    const recipient = e.target.value.trim();
    const recieverName = data.filter(name => name.email === recipient);
    openMailer(recipient, recieverName[0].name);
  });
});

}

function init() {
    setUpPage();
    setUpEventListener();
}

window.addEventListener('load', init);
document.addEventListener('DOMContentLoaded', init);