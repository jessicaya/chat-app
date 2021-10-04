const socket = io();
const messageOut = document.querySelector("input");
const messageIn = document.querySelector("#inmsg");
const locationIn = document.querySelector("#inloc");
const form = document.querySelector("form");
const submitButton = form.querySelector("button");
const messages = document.querySelector("#messages");
const sidebar = document.querySelector("#sidebar");
const messageTemplate = document.querySelector("#message-template").innerHTML;
const locationTemplate = document.querySelector("#location-template").innerHTML;
const sidebarTemplate = document.querySelector("#sidebar-template").innerHTML;

const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

const autoscroll = () => {
  const newMessage = messages.lastElementChild;
  const newStyle = getComputedStyle(newMessage);
  const newMessageMargin = parseInt(newStyle.marginBottom);
  const newMessageHeight = newMessage.offsetHeight + newMessageMargin;
  const visibleHeight = messages.offsetHeight;
  const containerHeight = messages.scrollHeight;
  const scrollOffset = messages.scrollTop + visibleHeight;
  if (containerHeight - newMessageHeight <= scrollOffset) {
    messages.scrollTop = messages.scrollHeight;
  }
};

console.log("socketidL " + socket.id);
socket.on("welcome", (msg) => {
  console.log(`welcome received: ${JSON.stringify(msg)}`);
  const innerHtml = Mustache.render(messageTemplate, {
    text: msg.text,
    username: msg.username,
    time: moment(msg.createdAt).format("h:mm a"),
  });
  messages.insertAdjacentHTML("beforeend", innerHtml);
  autoscroll();
});

socket.on("join", (msg) => {
  console.log(`join received: ${JSON.stringify(msg)}`);
  const innerHtml = Mustache.render(messageTemplate, {
    text: msg.text,
    username: msg.username,
    time: moment(msg.createdAt).format("h:mm a"),
  });
  messages.insertAdjacentHTML("beforeend", innerHtml);
});

socket.on("roomData", ({ room, users }) => {
  console.log("roomData", room, users);
  const innerHtml = Mustache.render(sidebarTemplate, {
    room,
    users,
  });
  sidebar.innerHTML = innerHtml;
});

socket.on("location", (msg) => {
  console.log("location received: " + JSON.stringify(msg));
  const innerHtml = Mustache.render(locationTemplate, {
    location: msg.url,
    username: msg.username,
    time: moment(msg.createdAt).format("h:mm a"),
  });
  //const innerHtml = Mustache.render(locationTemplate);
  //locationIn.innerHTML = innerHtml;
  //console.log("inner html: " + innerHtml);
  messages.insertAdjacentHTML("beforeend", innerHtml);
  autoscroll();
});

// socket.on("countUpdated", (count) => {
//   console.log("count has been updated: ", count);
// });

form.addEventListener("submit", (event) => {
  event.preventDefault();
  console.log("submitted: " + messageOut.value);
  socket.emit("sendMessage", messageOut.value, (error) => {
    if (error) {
      console.log(error);
    } else console.log("message delivered");
    messageOut.value = "";
    messageOut.focus();
    submitButton.removeAttribute("disabled");
  });
  submitButton.setAttribute("disabled", "disabled");
});

document.querySelector("#sendLocation").addEventListener("click", (event) => {
  if (!navigator.geolocation) {
    return alert("browser does not support geolocation");
  }

  navigator.geolocation.getCurrentPosition((position) => {
    console.log(position);
    socket.emit(
      "sendLocation",
      {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      },
      () => {
        console.log("location shared");
      }
    );
  });
});

socket.emit("join", { username, room }, (error) => {
  if (error) {
    alert(error);
    location.href = "/";
  } else console.log("successfully joined room");
});
