const {
  user,
  project,
  packager,
  category,
  packageItem,
  rundown,
  collection,
  collectionImages,
  detailInvoice,
  invoice,
  collectionMeta,
  event,
} = require("../models"); // Import all models

// user and project relationship
user.hasMany(project, { foreignKey: "id_user" });
project.belongsTo(user, { foreignKey: "id_user" });

// user and project relationship
user.hasMany(collection, { foreignKey: "id_user" });
collection.belongsTo(user, { foreignKey: "id_user" });

// project and rundown relationship
project.hasMany(rundown, { foreignKey: "id_project" });
rundown.belongsTo(project, { foreignKey: "id_project" });

// project and packager relationship
packager.hasMany(project, { foreignKey: "id_package" });
project.belongsTo(packager, { foreignKey: "id_package" });

// packager and packageItem relationship
packager.hasMany(packageItem, { foreignKey: "id_package" });
packageItem.belongsTo(packager, { foreignKey: "id_package" });

// packageItem and category relationship
category.hasMany(packageItem, { foreignKey: "id_category" });
packageItem.belongsTo(category, { foreignKey: "id_category" });

// project and invoice relationship
project.hasMany(invoice, { foreignKey: "id_project" });
invoice.belongsTo(project, { foreignKey: "id_project" });

// collection and collectionImages relationship
collection.hasMany(collectionImages, { foreignKey: "id_collection" });
collectionImages.belongsTo(collection, { foreignKey: "id_collection" });

// detailInvoice and invoice relationship
invoice.hasMany(detailInvoice, { foreignKey: "id_invoice" });
detailInvoice.belongsTo(invoice, { foreignKey: "id_invoice" });

// rundown and event relationship
rundown.hasMany(event, { foreignKey: "id_rundown" });
event.belongsTo(rundown, { foreignKey: "id_rundown" });
