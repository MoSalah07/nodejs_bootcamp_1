const getCourses = async () => {
  try {
    const res = await fetch("http://localhost:9000/api/courses", {
      method: "GET",
    });
    const data = await res.json();
    console.log(data);
  } catch (err) {
    console.log(err);
  }
};

getCourses();
