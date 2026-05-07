import { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import Loader from "../components/Loader";
import api from "../services/api";

const initialForm = {
  name: "",
  email: "",
  phone: "",
  skills: "",
  availability: "Weekends",
  city: "",
  hours: ""
};

export default function Volunteers() {
  const [volunteers, setVolunteers] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/volunteers")
      .then((res) => setVolunteers(res.data))
      .finally(() => setLoading(false));
  }, []);

  const updateField = (event) => setForm({ ...form, [event.target.name]: event.target.value });

  const addVolunteer = async (event) => {
    event.preventDefault();
    const res = await api.post("/volunteers", form);
    setVolunteers([res.data, ...volunteers]);
    setForm(initialForm);
  };

  const totalHours = volunteers.reduce((sum, volunteer) => sum + Number(volunteer.hours || 0), 0);

  return (
    <DashboardLayout title="Volunteers" eyebrow="People operations">
      <section className="summary-band">
        <div><strong>{volunteers.length}</strong><span>registered volunteers</span></div>
        <div><strong>{totalHours}</strong><span>logged hours</span></div>
        <div><strong>{new Set(volunteers.map((item) => item.city)).size}</strong><span>cities covered</span></div>
      </section>

      <form className="panel-form" onSubmit={addVolunteer}>
        <input name="name" value={form.name} placeholder="Volunteer name" onChange={updateField} />
        <input name="email" value={form.email} placeholder="Email" onChange={updateField} />
        <input name="phone" value={form.phone} placeholder="Phone" onChange={updateField} />
        <input name="skills" value={form.skills} placeholder="Skills separated by commas" onChange={updateField} />
        <select name="availability" value={form.availability} onChange={updateField}>
          <option>Weekends</option>
          <option>Weekdays</option>
          <option>Evenings</option>
          <option>Flexible</option>
        </select>
        <input name="city" value={form.city} placeholder="City" onChange={updateField} />
        <input name="hours" value={form.hours} placeholder="Hours" onChange={updateField} />
        <button type="submit">Add Volunteer</button>
      </form>

      {loading ? (
        <Loader />
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Skills</th>
                <th>Availability</th>
                <th>City</th>
                <th>Hours</th>
              </tr>
            </thead>
            <tbody>
              {volunteers.map((volunteer) => (
                <tr key={volunteer._id}>
                  <td>{volunteer.name}</td>
                  <td>{volunteer.email}</td>
                  <td>{volunteer.phone || "-"}</td>
                  <td>{volunteer.skills?.join(", ") || "-"}</td>
                  <td>{volunteer.availability}</td>
                  <td>{volunteer.city || "-"}</td>
                  <td>{volunteer.hours || 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </DashboardLayout>
  );
}
