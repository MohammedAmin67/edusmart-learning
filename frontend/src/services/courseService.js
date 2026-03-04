import API from "../api/axios";

const courseService = {
  // Get all courses
  getAllCourses: async () => {
    try {
      const response = await API.get("/courses");
      return response.data;
    } catch (error) {
      throw error.response?.data || { msg: "Failed to fetch courses" };
    }
  },

  // Get courses by instructor (faculty)
  getMyCourses: async () => {
    try {
      const response = await API.get("/courses/my-courses");
      return response.data;
    } catch (error) {
      throw error.response?.data || { msg: "Failed to fetch your courses" };
    }
  },

  // Get single course by ID
  getCourseById: async (courseId) => {
    try {
      const response = await API.get(`/courses/${courseId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { msg: "Failed to fetch course" };
    }
  },

  // Create new course
  createCourse: async (courseData) => {
    try {
      const response = await API.post("/courses", courseData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { msg: "Failed to create course" };
    }
  },

  // Update course
  updateCourse: async (courseId, courseData) => {
    try {
      const response = await API.put(`/courses/${courseId}`, courseData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { msg: "Failed to update course" };
    }
  },

  // Delete course
  deleteCourse: async (courseId) => {
    try {
      const response = await API.delete(`/courses/${courseId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { msg: "Failed to delete course" };
    }
  },

  // Enroll in course (for students)
  enrollInCourse: async (courseId) => {
    try {
      const response = await API.post(`/courses/${courseId}/enroll`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { msg: "Failed to enroll in course" };
    }
  },

  // Upload course thumbnail
  uploadThumbnail: async (courseId, file) => {
    try {
      const formData = new FormData();
      formData.append("thumbnail", file);
      const response = await API.post(
        `/courses/${courseId}/thumbnail`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || { msg: "Failed to upload thumbnail" };
    }
  },
};

export default courseService;
