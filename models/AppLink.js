const yup = require("yup");

const appLinkSchema = yup.object().shape({
  name: yup.string().required(),
  icon: yup.string().required(),
  url: yup.string().url().required(),
});

class AppLink {
  constructor(name, icon, url) {
    this.name = name;
    this.icon = icon;
    this.url = url;
  }
}

function validateAppLink(appLink) {
  return appLinkSchema.validate(appLink);
}

module.exports = { AppLink, validateAppLink };
