const yup = require("yup");

class AppLink {
  constructor(appLink) {
    this.appLink = appLink;
  }

  validateAppLink() {
    let appLinkSchema = yup.object().shape({
      name: yup.string().required(),
      icon: yup.string().required(),
      url: yup.string().url().required(),
    });

    return appLinkSchema.validate(this.appLink);
  }
}

module.exports = { AppLink };
