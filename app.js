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
async function login() {
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
  } else {
    alert("Login Successful");
  }
  window.location.href = "/mainpage.html";
}
window.register = register;
window.login = login;
// window.logout = logout;