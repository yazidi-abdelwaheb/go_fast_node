import Texts from "./text.shema.js";
import {
  CustomError,
  errorCatch,
  getPaginatedData,
  UserLanguagesEnum
} from "../../shared/shared.exports.js";

const model = Texts;

export default class TextsController {

  static async getTexts (req, res)  {
    try {
      const lang = req.query.lang || "en"; // default language english = "en"
  
      if (!Object.values(UserLanguagesEnum).includes(lang)) {
        throw new CustomError('Language not supported' , 400)
      }
  
      const texts = await model.aggregate([
        {
          $project: {
            _id: 0, // Exclure l'ID MongoDB
            key: 1,
            text: `$${lang}`, // Dynamiser la clé pour retourner uniquement la langue demandée
          },
        },
      ]);
  
      // Transformer en format { key: "texte" }
      const formattedTexts = texts.reduce((acc, item) => {
        acc[item.key] = item.text;
        return acc;
      }, {});
  
      res.status(200).json(formattedTexts);
    } catch (e) {
      return errorCatch(e, res);
    }
  };

  static async getList(req, res) {
    /**
     * #swagger.summary  = "Get list of Texts."
     */
    try {
      const page = parseInt(req.query.page, 10) || 1;
      const limit = parseInt(req.query.limit, 10) || 10;
      const search = req.query.search || "";

      const { data, totalElement, totalPages } = await getPaginatedData(
        model,
        page,
        limit,
        search,
        ["key", "fr", "en", "es", "ar"],
        {},
        {}
      );

      res.status(200).json({
        totalElement,
        totalPages,
        currentPageNumber: page,
        currentPageSize: limit,
        data,
      });
    } catch (error) {
      errorCatch(error, res);
    }
  }

  static async createOne(req, res) {
    /**
     * #swagger.summary = "create a new text"
     * 
     * #swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    example:{
                     text :  {
                        key: "welcome",
                        fr: "Bienvenu",
                        en: "Welcome",
                        ar: "مرحباً",
                        es: "Bienvenida",
                      }
                    }
                }
            }
        }
    
     */
    try {
      const { text } = req.body;

      await new model({
        key: text.key,
        fr: text.fr,
        en: text.en,
        es: text.es,
        ar: text.ar,
      }).save();

      res.status(201).json({ message: "Text created successfully." });
    } catch (error) {
      errorCatch(error, res);
    }
  }

  static async readOne(req, res) {
    /**
     * #swagger.summary = "Read one by Id of text."
     */
    try {
      const id = req.params.id;
      const text = await model.findById(id);
      res.status(200).json(text);
    } catch (error) {
      errorCatch(error, res);
    }
  }

  static async updateOne(req, res) {
    /**
     * #swagger.summary = "update one of text."
     * #swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    example:{
                     text :  {
                        key: "welcome",
                        fr: "Bienvenu",
                        en: "Welcome",
                        ar: "مرحباً",
                        es: "Bienvenida",
                      }
                    }
                }
            }
        }
     */
    try {
      const _id = req.params.id;
      const { text } = req.body;
      await model.updateOne(
        { _id },
        {
          key: text.key,
          fr: text.fr,
          en: text.en,
          es: text.es,
          ar: text.ar,
        }
      );

      res.status(200).json({ message: "Text updated successfully." });
    } catch (error) {
      errorCatch(error, res);
    }
  }

  static async deleteOne(req, res) {
    /**
     * #swagger.summary ="Delete one of text."
     */
    try {
      const _id = req.params.id;
      await model.deleteOne({ _id });

      res.status(200).json({ message: "Text deleted successfully." });
    } catch (error) {
      errorCatch(error, res);
    }
  }
}
