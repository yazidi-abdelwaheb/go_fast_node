import jwt from "jsonwebtoken";
import Users from "../../modules/users/users.schema.js";
import crypto, { randomUUID } from "crypto";
import Orders from "../../modules/orders/orders.schema.js";
import multer from "multer";

/*********************** Error handler ***********************/

/**
 *Custom Error for define message error and stutes code error
 * @param {*} message
 * @param {*} statusCode
 */
export class CustomError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 *
 * @param {CustomError} error error message
 * @param {Response} res This Fetch API interface represents the response to a request
 * @returns {Response}  response object with error message and status code
 */
export const errorCatch = (error, req, res) => {
  const endpoint = `${req.method} ${req.originalUrl}` || "Unknown endpoint";
  const statusCode = error.statusCode || 500;
  const message = error.message || "Server Error";
  console.error(`[${endpoint}] : ${message} - ${statusCode}`);
  return res.status(statusCode).json({ message: message });
};

/***********************  generations tools ***********************/

/**
 * generation json web token
 * @param {Object} user user details
 * @param {number} expiresIn duration of the token expire en milliseconds . `default = Infinity`
 * @returns {string} JWT token
 */
export const generation_JWT_Token = (user, expiresIn = Infinity) => {
  return jwt.sign(
    {
      _id: user._id,
      type: user.type,
      companyId: user.companyId,
      defaultLink: user.defaultLink,
      groupId: user.groupId,
    },
    process.env.JWT_SECRET,
    { expiresIn: expiresIn }
  );
};

/**
 * auto generation unique username form a first name
 * @param {string} first_name
 * @returns {Promise<string>} username
 */
export const generateUniqueUsername = async (first_name) => {
  let baseUsername = first_name.toLowerCase().replace(/\s+/g, "");
  let username = baseUsername;
  let exists = await Users.findOne({ username });

  while (exists) {
    const randomSuffix = crypto.randomBytes(3).toString("hex");
    username = `${baseUsername}#${randomSuffix}`;
    exists = await Users.findOne({ username });
  }

  return username;
};

/**
 * auto generation unique code for shared to client
 *
 * @returns {Promise<string>} UUID code
 */
export const generateUniqueCodeForOrders = async () => {
  let code = randomUUID();
  let exists = await Orders.findOne({ shared_code: code });

  while (exists) {
    code = randomUUID();
    exists = await Orders.findOne({ shared_code: code });
  }

  return code;
};

/**
 * Function to fetch paginated data with filtering, search, and optional population.
 *
 * @param {object} model - Mongoose model.
 * @param {number} page - Page number (default: 1).
 * @param {number} limit - Number of documents per page (default: 10).
 * @param {string} search - Search term (optional).
 * @param {Array<string>} searchFields - Fields to search in (optional).
 * @param {object} conditions - Additional filtering conditions (optional).
 * @param {object} populateOption - Field to populate (optional).
 * @returns {Promise<Object>} - Returns an object containing paginated data, total count, and total pages.
 */
export const getPaginatedData = async (
  model,
  page = 1,
  limit = 10,
  search = "",
  searchFields = [],
  conditions = {},
  populateOption = {}
) => {
  const startIndex = (page - 1) * limit;

  // Build search query dynamically
  const searchQuery =
    search && searchFields.length
      ? {
          $or: searchFields.map((field) => ({
            [field]: { $regex: search, $options: "i" },
          })),
        }
      : {};

  // MongoDB aggregation pipeline
  const pipeline = [
    { $match: {  ...searchQuery } },// search

    // Population (optional)
    ...(populateOption
      ? [
          {
            $lookup: {
              from: populateOption.from,
              localField: populateOption.localField,
              foreignField: populateOption.foreignField,
              as: populateOption.as,
            },
          },
          {
            $unwind: {
              path: `$${populateOption.as}`,
              preserveNullAndEmptyArrays: true,
            },
          },
        ]
      : []),
      { $match: { ...conditions } }, //Filtering

    { $sort: { createdAt: -1 } }, // Sort by latest created

    // Pagination stages
    {
      $facet: {
        data: [{ $skip: startIndex }, { $limit: limit }], // Paginate results
        totalCount: [{ $count: "count" }], // Count total documents
      },
    },

    // Flatten the total count for easy access
    { $unwind: { path: "$totalCount", preserveNullAndEmptyArrays: true } },
  ];

  // Execute aggregation
  const result = await model.aggregate(pipeline);
  const data = result[0]?.data || [];
  const totalElement = result[0]?.totalCount?.count || 0;
  const totalPages = Math.ceil(totalElement / limit);

  return { data, totalElement, totalPages };
};

