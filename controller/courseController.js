// const fs = require('fs');
const Course = require("../model/courseModel");

// const courses = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/data/course-simple.json`)
// );

exports.getAllCourses = async (req, res) => {
  console.log("courseController getAllCourses 进来啦");
  try {
    // BUILD QUERY
    // 1) Filtering
    //const queryObj = { ...req.query };
    const queryObj = req.query ;
    const excludedFields = ["page", "sort", "limit", "fields"];
    excludedFields.forEach((el) => delete queryObj[el]);

    // 2) Advanced filtering
    let queryString = JSON.stringify(queryObj);
    queryString = queryString.replace(
      /\b(gte|gt|lte|le)\b/g,
      (match) => `$${match}`
    );
    // console.log(queryString);
    const query = Course.find(JSON.parse(queryString)).select(
      "rating isFavorite title price imageUrl description"
    );
    // console.log(query);
    // EXECUTE QUERY
    const courses = await query;
    // console.log(courses);

    // SEND RESPONSE
    res.status(200).json({
      status: "success",
      resulrs: courses.length,
      data: {
        courses,
      },
    });
  } catch (err) {
    res.status(404).json({ status: "fail", message: err });
  }
};

exports.getCourse = async function(req, res)  {
  console.log("getCourse 进来啦");
  try {
    const course = await Course.findById(req.params.id);
    // .populate('reviews')
    // .populate({ path: 'registedUsers', select: 'course' });
    console.log(course);
    res.status(200).json({
      status: "success",
      data: {
        course,
      },
    });
  } catch (err) {
    res.status(404).json({ status: "fail", message: err });
  }
};

exports.createCourse = async (req, res) => {

  try {
    const newCourse = await Course.create(req.body);
    res.status(201).json({
      status: "scccess",
      data: newCourse,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};
exports.updateCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      status: "scccess",
      data: {
        course,
      },
    });
  } catch (err) {
    res.status(404).json({ status: "fail", message: err });
  }
};
exports.deleteCourse = async (req, res) => {
  try {
    const ttt = await Course.findByIdAndDelete(req.params.id);

    if (ttt != null) {
      res.status(204).json({
        status: "scccess",
        data: null,
      });
    } else {
      res.status(404).json({ status: "fail", message: "not found" });
    }
  } catch (err) {
    res.status(404).json({ status: "fail", message: err });
  }
};
