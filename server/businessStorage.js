const shorthash = require('shorthash').unique;

let barStorage = {};

function findOrCreateBusiness(id) {
  let bar = barStorage[shorthash(id)];

  if (!bar) {
    bar = {
      attendees: []
    };
  }

  return bar;
}

function setBusiness(id, business) {
  barStorage[shorthash(id)] = business;
}

function attendBusiness(id, userId) {
  let bar = findOrCreateBusiness(id);

  if (!isAttendingBusiness(bar, userId)) {
    bar.attendees.push(userId + '');
  }

  setBusiness(id, bar);

  return true;
}

function unattendBusiness(id, userId) {
  let bar = findOrCreateBusiness(id);

  if (isAttendingBusiness(bar, userId)) {
    bar.attendees.splice(bar.attendees.indexOf(userId), 1);
  }

  setBusiness(id, bar);

  return true;
}

function isAttendingBusiness(bar, userId) {
  return bar.attendees.includes(userId + '');
}

module.exports = {
  findOrCreateBusiness,
  attendBusiness,
  unattendBusiness,
  isAttendingBusiness
};
