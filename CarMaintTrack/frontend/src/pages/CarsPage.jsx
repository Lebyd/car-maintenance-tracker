import { useEffect, useState } from "react";
import apiClient from "../api/apiClient";

function CarsPage() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Form data for adding a new car
  const [formData, setFormData] = useState({
    ownerId: "",
    brand: "",
    model: "",
    year: "",
    vin: "",
    licensePlate: "",
    currentMileage: "",
  });

  // Filters for searching cars
  const [filters, setFilters] = useState({
    ownerId: "",
    brand: "",
    minYear: "",
    maxYear: "",
    sortBy: "year",
    sortOrder: "desc",
  });

  const fetchCars = async () => {
    try {
      setLoading(true);
      setError("");

      const params = {};

      if (filters.ownerId) params.ownerId = filters.ownerId;
      if (filters.brand.trim()) params.brand = filters.brand.trim();
      if (filters.minYear) params.minYear = filters.minYear;
      if (filters.maxYear) params.maxYear = filters.maxYear;
      if (filters.sortBy) params.sortBy = filters.sortBy;
      if (filters.sortOrder) params.sortOrder = filters.sortOrder;

      const res = await apiClient.get("/cars", { params });

      // Your /cars endpoint returns { data, pagination }, so we use data
      setCars(res.data.data || res.data);
    } catch (err) {
      setError("Failed to load cars. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCars();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // initial load

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle filter changes (for search form)
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    fetchCars();
  };

  const handleClearFilters = () => {
    setFilters({
      ownerId: "",
      brand: "",
      minYear: "",
      maxYear: "",
      sortBy: "year",
      sortOrder: "desc",
    });
    fetchCars();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Simple client-side validation
    if (
      !formData.ownerId ||
      !formData.brand.trim() ||
      !formData.model.trim() ||
      !formData.year ||
      !formData.vin.trim()
    ) {
      setError("Please fill in all required fields (*).");
      return;
    }

    try {
      const payload = {
        ...formData,
        ownerId: Number(formData.ownerId),
        year: Number(formData.year),
        currentMileage: formData.currentMileage
          ? Number(formData.currentMileage)
          : 0,
      };

      await apiClient.post("/cars", payload);
      setSuccess("Car added successfully!");

      // Reset form
      setFormData({
        ownerId: "",
        brand: "",
        model: "",
        year: "",
        vin: "",
        licensePlate: "",
        currentMileage: "",
      });

      fetchCars();
    } catch (err) {
      setError(
        err.response?.data?.errors?.[0]?.msg ||
          err.response?.data?.message ||
          "Failed to add car."
      );
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this car?")) return;
    setError("");
    setSuccess("");

    try {
      await apiClient.delete(`/cars/${id}`);
      setSuccess("Car deleted successfully.");
      fetchCars();
    } catch (err) {
      setError("Failed to delete car.");
    }
  };

  return (
    <div className="container">
      <h1>Car Maintenance Tracker – Cars</h1>

      {/* Messages */}
      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {/* Filters */}
      <section className="card">
        <h2>Filter & Sort Cars</h2>
        <form onSubmit={handleFilterSubmit} className="form-grid">
          <div className="form-group">
            <label>
              Owner ID:
              <input
                type="number"
                name="ownerId"
                value={filters.ownerId}
                onChange={handleFilterChange}
              />
            </label>
          </div>

          <div className="form-group">
            <label>
              Brand:
              <input
                type="text"
                name="brand"
                value={filters.brand}
                onChange={handleFilterChange}
              />
            </label>
          </div>

          <div className="form-group">
            <label>
              Min Year:
              <input
                type="number"
                name="minYear"
                value={filters.minYear}
                onChange={handleFilterChange}
              />
            </label>
          </div>

          <div className="form-group">
            <label>
              Max Year:
              <input
                type="number"
                name="maxYear"
                value={filters.maxYear}
                onChange={handleFilterChange}
              />
            </label>
          </div>

          <div className="form-group">
            <label>
              Sort By:
              <select
                name="sortBy"
                value={filters.sortBy}
                onChange={handleFilterChange}
              >
                <option value="year">Year</option>
                <option value="currentMileage">Mileage</option>
                <option value="brand">Brand</option>
                <option value="createdAt">Created At</option>
              </select>
            </label>
          </div>

          <div className="form-group">
            <label>
              Sort Order:
              <select
                name="sortOrder"
                value={filters.sortOrder}
                onChange={handleFilterChange}
              >
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
              </select>
            </label>
          </div>

          <div className="form-group">
            <button type="submit" className="btn-primary">
              Apply Filters
            </button>
          </div>

          <div className="form-group">
            <button
              type="button"
              className="btn-secondary"
              onClick={handleClearFilters}
            >
              Clear Filters
            </button>
          </div>
        </form>
      </section>

      {/* Add Car Form */}
      <section className="card">
        <h2>Add New Car</h2>
        <form onSubmit={handleSubmit} className="form-grid">
          <div className="form-group">
            <label>
              Owner ID*:
              <input
                type="number"
                name="ownerId"
                value={formData.ownerId}
                onChange={handleChange}
                required
              />
            </label>
          </div>

          <div className="form-group">
            <label>
              Brand*:
              <input
                type="text"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                required
              />
            </label>
          </div>

          <div className="form-group">
            <label>
              Model*:
              <input
                type="text"
                name="model"
                value={formData.model}
                onChange={handleChange}
                required
              />
            </label>
          </div>

          <div className="form-group">
            <label>
              Year*:
              <input
                type="number"
                name="year"
                value={formData.year}
                onChange={handleChange}
                required
              />
            </label>
          </div>

          <div className="form-group">
            <label>
              VIN*:
              <input
                type="text"
                name="vin"
                value={formData.vin}
                onChange={handleChange}
                required
              />
            </label>
          </div>

          <div className="form-group">
            <label>
              License Plate:
              <input
                type="text"
                name="licensePlate"
                value={formData.licensePlate}
                onChange={handleChange}
              />
            </label>
          </div>

          <div className="form-group">
            <label>
              Current Mileage:
              <input
                type="number"
                name="currentMileage"
                value={formData.currentMileage}
                onChange={handleChange}
              />
            </label>
          </div>

          <button type="submit" className="btn-primary">
            Save Car
          </button>
        </form>
      </section>

      {/* Cars List */}
      <section className="card">
        <h2>All Cars</h2>
        {loading ? (
          <p>Loading cars...</p>
        ) : cars.length === 0 ? (
          <p>No cars found. Try updating filters or add a new car above.</p>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Owner ID</th>
                <th>Brand</th>
                <th>Model</th>
                <th>Year</th>
                <th>VIN</th>
                <th>Plate</th>
                <th>Mileage</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {cars.map((car) => (
                <tr key={car.id}>
                  <td>{car.id}</td>
                  <td>{car.ownerId}</td>
                  <td>{car.brand}</td>
                  <td>{car.model}</td>
                  <td>{car.year}</td>
                  <td>{car.vin}</td>
                  <td>{car.licensePlate}</td>
                  <td>{car.currentMileage}</td>
                  <td>
                    <button
                      className="btn-danger"
                      onClick={() => handleDelete(car.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}

export default CarsPage;
