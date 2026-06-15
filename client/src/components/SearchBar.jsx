function SearchBar({ search, setSearch, category, setCategory }) {

  return (
    <div className="flex flex-col md:flex-row gap-4 mt-6">

      <input
        type="text"
        placeholder="Search opportunities..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border rounded-lg p-3 flex-1"
      />


      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="border rounded-lg p-3"
      >

        <option value="">
          All Categories
        </option>

        <option value="Internship">
          Internship
        </option>

        <option value="Job">
          Job
        </option>

        <option value="Hackathon">
          Hackathon
        </option>

        <option value="Scholarship">
          Scholarship
        </option>

        <option value="Fellowship">
          Fellowship
        </option>

        <option value="Competition">
          Competition
        </option>

      </select>

    </div>
  );
}

export default SearchBar;