import { useEffect, useMemo, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import Loader from "../components/Loader";
import api from "../services/api";

const initialForm = {
  donorName: "",
  email: "",
  amount: "",
  campaign: "",
  method: "UPI",
  status: "Completed"
};

export default function Donations() {
  const [data, setData] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([
      api.get("/donations"),
      api.get("/campaigns")
    ])
      .then(([donationsRes, campaignsRes]) => {
        const activeCampaigns = campaignsRes.data.filter((campaign) => campaign.status === "Active");
        setData(donationsRes.data);
        setCampaigns(activeCampaigns);
        setForm((currentForm) => ({
          ...currentForm,
          campaign: activeCampaigns[0]?.title || ""
        }));
      })
      .finally(() => setLoading(false));
  }, []);

  const updateField = (event) => setForm({ ...form, [event.target.name]: event.target.value });

  const addDonation = async (event) => {
    event.preventDefault();
    setError("");

    try {
      const res = await api.post("/donations", form);
      const donation = res.data.donation || res.data;
      setData([donation, ...data]);
      setForm({ ...initialForm, campaign: campaigns[0]?.title || "" });

      if (res.data.campaign) {
        const updatedCampaign = res.data.campaign;
        window.dispatchEvent(new CustomEvent("campaignUpdated", { detail: updatedCampaign }));

        setCampaigns((currentCampaigns) => currentCampaigns
          .map((item) => item._id === updatedCampaign._id ? updatedCampaign : item)
          .filter((item) => item.status === "Active")
        );
      }
    } catch (err) {
      setError(err.response?.data?.message || "Unable to record donation");
    }
  };

  const filteredData = useMemo(() => {
    return filter === "All" ? data : data.filter((donation) => donation.status === filter);
  }, [data, filter]);

  const total = data
    .filter((donation) => donation.status === "Completed")
    .reduce((sum, donation) => sum + Number(donation.amount || 0), 0);

  return (
    <DashboardLayout title="Donations" eyebrow="Donor desk">
      <section className="summary-band">
        <div><strong>Rs {total.toLocaleString("en-IN")}</strong><span>completed donations</span></div>
        <div><strong>{data.length}</strong><span>total records</span></div>
        <div><strong>{data.filter((item) => item.status === "Pending").length}</strong><span>pending follow-ups</span></div>
      </section>

      <form className="panel-form" onSubmit={addDonation}>
        <input name="donorName" value={form.donorName} placeholder="Donor name" onChange={updateField} />
        <input name="email" value={form.email} placeholder="Email" onChange={updateField} />
        <input name="amount" value={form.amount} placeholder="Amount" onChange={updateField} />
        <select name="campaign" value={form.campaign} onChange={updateField} disabled={campaigns.length === 0}>
          {campaigns.length === 0 ? (
            <option>No active campaigns</option>
          ) : (
            campaigns.map((campaign) => (
              <option key={campaign._id}>{campaign.title}</option>
            ))
          )}
        </select>
        <select name="method" value={form.method} onChange={updateField}>
          <option>UPI</option>
          <option>Card</option>
          <option>Bank Transfer</option>
          <option>Cash</option>
        </select>
        <select name="status" value={form.status} onChange={updateField}>
          <option>Completed</option>
          <option>Pending</option>
          <option>Failed</option>
        </select>
        <button type="submit" disabled={campaigns.length === 0}>Record Donation</button>
      </form>
      {error && <div className="error">{error}</div>}
      {campaigns.length === 0 && !loading && (
        <div className="error">Donations are closed because there are no active campaigns.</div>
      )}

      <div className="filter-tabs">
        {["All", "Completed", "Pending", "Failed"].map((item) => (
          <button className={filter === item ? "active" : ""} type="button" key={item} onClick={() => setFilter(item)}>
            {item}
          </button>
        ))}
      </div>

      {loading ? (
        <Loader />
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Donor</th>
                <th>Campaign</th>
                <th>Amount</th>
                <th>Method</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((donation) => (
                <tr key={donation._id}>
                  <td>{donation.donorName}<small>{donation.email}</small></td>
                  <td>{donation.campaign}</td>
                  <td>Rs {Number(donation.amount).toLocaleString("en-IN")}</td>
                  <td>{donation.method}</td>
                  <td><span className={`status ${donation.status.toLowerCase()}`}>{donation.status}</span></td>
                  <td>{donation.donatedAt || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </DashboardLayout>
  );
}
