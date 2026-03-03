import supabase from "./supabase.js";
const signUpButton = document.getElementById('signUp');
const signInButton = document.getElementById('signIn');
const container = document.getElementById('container');

signUpButton.addEventListener('click', () => {
  container.classList.add("right-panel-active");
});

signInButton.addEventListener('click', () => {
  container.classList.remove("right-panel-active");
});


async function register() {
  event.preventDefault();
  var name = document.getElementById("name").value;
  var email = document.getElementById("email").value;
  var phone = document.getElementById("phone").value;
  var password = document.getElementById("pswrd").value;
  var cpassword = document.getElementById("cpswrd").value;

  var formdata = {
    name: name,
    email,
    phone,
    password,
    cpassword,
  };
  if (!name) {
    alert("Name is required");
  } else if (password !== cpassword) {
    alert("Passwords should be identical");
  } else {
    // localStorage.setItem("data",JSON.stringify(data))
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (data) console.log(data);
    if (error) {
      console.log(error);
      alert(error.message);
    } else {
      alert(name + " Registered Successfully");
    }

    // window.location.href="/dashboard.html"
  }
}
async function login(event) {
  event.preventDefault();
  var loginEmail = document.getElementById("loginEmail").value;
  var loginPass = document.getElementById("loginPass").value;
  // var getData = JSON.parse(localStorage.getItem("data"))
  // console.log(loginEmail,getData.email, loginPass,getData.password);

  const { data, error } = await supabase.auth.signInWithPassword({
    email: loginEmail,
    password: loginPass,
  });
  if (data) console.log(data);
  if (error) {
    console.log(error);
    alert(error.message);
    return
  }else {
 alert("Login Successful 🎉")
    window.location.href = "/mainpage.html";
}
}
window.register = register;
window.login = login;
// window.logout = logout;

// Theme Cycling Logic
const lampFixture = document.querySelector('.lamp-fixture');
const themes = ['theme-orange', 'theme-blue', 'theme-purple', 'theme-green'];
let currentThemeIndex = -1;

if (lampFixture) {
  lampFixture.addEventListener('click', () => {
    // Remove current theme
    if (currentThemeIndex !== -1) {
      document.body.classList.remove(themes[currentThemeIndex]);
    }

    // Cycle to next theme
    currentThemeIndex = (currentThemeIndex + 1) % themes.length;
    document.body.classList.add(themes[currentThemeIndex]);

    // Premium Bounce Animation
    lampFixture.style.transform = 'translateY(10px) scale(0.95)';
    setTimeout(() => {
      lampFixture.style.transform = '';
    }, 300);
  });
}
