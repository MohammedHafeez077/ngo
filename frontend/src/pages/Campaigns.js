import { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import Loader from "../components/Loader";
import api from "../services/api";

const initialForm = {
  title: "",
  category: "",
  description: "",
  goalAmount: "",
  raisedAmount: "",
  beneficiaries: "",
  location: ""
};

export default function Campaigns() {
  const [campaigns, setCampaigns] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(true);
  const [statusError, setStatusError] = useState("");
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const isAdmin = user?.role === "admin";

  const loadCampaigns = () => {
    api.get("/campaigns")
      .then((res) => setCampaigns(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(loadCampaigns, []);

  useEffect(() => {
    const handleCampaignUpdate = (event) => {
      const updatedCampaign = event.detail;
      setCampaigns((current) => current.map((campaign) => (
        campaign._id === updatedCampaign._id ? updatedCampaign : campaign
      )));
    };

    window.addEventListener("campaignUpdated", handleCampaignUpdate);
    return () => window.removeEventListener("campaignUpdated", handleCampaignUpdate);
  }, []);

  const updateField = (event) => setForm({ ...form, [event.target.name]: event.target.value });

  const addCampaign = async (event) => {
    event.preventDefault();
    const res = await api.post("/campaigns", form);
    setCampaigns([res.data, ...campaigns]);
    setForm(initialForm);
  };

  const updateCampaignStatus = async (campaignId, status) => {
    setStatusError("");

    try {
      const res = await api.patch(`/campaigns/${campaignId}/status`, { status });
      setCampaigns(campaigns.map((campaign) => (
        campaign._id === campaignId ? res.data : campaign
      )));
    } catch (err) {
      setStatusError(err.response?.data?.message || "Unable to update campaign status");
    }
  };

  return (
    <DashboardLayout title="Campaigns" eyebrow="Program portfolio">
      <form className="panel-form" onSubmit={addCampaign}>
        <input name="title" value={form.title} placeholder="Campaign title" onChange={updateField} />
        <input name="category" value={form.category} placeholder="Category" onChange={updateField} />
        <input name="goalAmount" value={form.goalAmount} placeholder="Goal amount" onChange={updateField} />
        <input name="raisedAmount" value={form.raisedAmount} placeholder="Raised amount" onChange={updateField} />
        <input name="beneficiaries" value={form.beneficiaries} placeholder="Beneficiaries" onChange={updateField} />
        <input name="location" value={form.location} placeholder="Location" onChange={updateField} />
        <textarea name="description" value={form.description} placeholder="Campaign description" onChange={updateField} />
        <button type="submit">Add Campaign</button>
      </form>
      {statusError && <div className="error">{statusError}</div>}

      {loading ? (
        <Loader />
      ) : (
        <div className="campaign-list">
          {campaigns.map((campaign) => {
            const progress = Math.min(100, Math.round((campaign.raisedAmount / campaign.goalAmount) * 100));
            return (
              <section className="card campaign-card" key={campaign._id}>
                <div className="card-topline">
                  <span>{campaign.category}</span>
                  {isAdmin ? (
                    <label className="status-editor">
                      Status
                      <select
                        value={campaign.status}
                        onChange={(event) => updateCampaignStatus(campaign._id, event.target.value)}
                      >
                        <option>Active</option>
                        <option>Paused</option>
                        <option>Completed</option>
                      </select>
                    </label>
                  ) : (
                    <b>{campaign.status}</b>
                  )}
                </div>
                <h3>{campaign.title}</h3>
                <p>{campaign.description}</p>
                <div className="progress"><span style={{ width: `${progress}%` }} /></div>
                <div className="card-metrics">
                  <span>Rs {Number(campaign.raisedAmount).toLocaleString("en-IN")} raised</span>
                  <span>{campaign.beneficiaries} people</span>
                  <span>{campaign.location}</span>
                </div>
              </section>
            );
          })}
        </div>
      )}
    </DashboardLayout>
  );
}
