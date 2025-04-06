//import { askQuestion } from "../utils.js";
import { setupMongoServer } from "../../config/db.config.js";
import Features from "../../modules/features/features.schema.js";
import { loadData } from "../utils.js";

const addFeaturesMigration = async () => {
  try {
    // Your migration logic here

    //load data from file  ../data/ 
    let newFeatures;
    try {
      newFeatures = await loadData("features");
    } catch (error) {
      throw new Error(error.message);
    }

    // connect to database
    await setupMongoServer();

    // fetch all oldfeatures
    const oldFeatures = await Features.find();

    // remove all old features  from database
    await Features.deleteMany();

    for await (const newFeature of newFeatures) {
      const feature = new Features({
        _id: newFeature._id,
        code: newFeature.code,
        title: newFeature.title,
        status: newFeature.status,
        type: newFeature.type,
        icon: newFeature.icon,
        featuresIdParent: newFeature.featuresIdParent,
        divider: newFeature.divider,
        link: newFeature.link,
        order: newFeature.order,
        subtitle: newFeature.subtitle,
      });
      const oldFeature = oldFeatures.find((f) => (f.code === newFeature.code));
      if (oldFeature && oldFeature._id) {
        feature._id = oldFeature._id;
      }
      if (oldFeature && oldFeature.featuresIdParent) {
        feature.featuresIdParent = oldFeature.featuresIdParent;
      }
      await feature.save();
    }
    const features = await Features.find();
    for await (const feature of features) {
      feature.code = feature.title.toLowerCase().replace(/[()]/g, '').replace('/', ' ').split(' ')
        .join('-');
      await feature.save();
    }

    console.log();
    console.log("Features created successfully!"); 
  } catch (e) {
    console.error("An error occurred while running the migration: ", e);
  } finally {
    process.exit(0);
  }
};

// Run the migration
addFeaturesMigration();
