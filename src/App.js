import { Star, StarBorder, DeleteOutlineOutlined } from "@mui/icons-material";
import getRecipes from "./services/recipes";
import { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import "./App.css";

function App() {
  const WeekTabs = ["All Meals", "Week 1", "Week 2", "Week 3", "Week 4"];
  const [SelectedItems, setSelectedItems] = useState([]);
  const [SelectedWeek, setSelectedWeek] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [SaveModelActive, setSaveModelActive] = useState(false);
  const [WeeksData, setWeeksData] = useState([[], [], [], [], []]);

  const handleTabClick = (index) => {
    setActiveTab(index);
  };

  const saveHandler = () => {
    if (SelectedItems.length > 0 && SelectedWeek !== null) {
      
      setWeeksData((prevWeeksData) => {
        const newWeeksData = prevWeeksData.map((week) => [...week]);
  
        SelectedItems.forEach((itemId) => {
          document
            .getElementById(`recipe-${itemId}`)
            .children[0].classList.remove("active");
  
          const itemToAdd = newWeeksData[activeTab].find(
            (recipe) => recipe.id === itemId
          );
  
          if (
            itemToAdd &&
            !newWeeksData[SelectedWeek + 1].some((recipe) => recipe.id === itemId)
          ) {
            newWeeksData[SelectedWeek + 1].push(itemToAdd);
          }
        });
  

        return newWeeksData;
      });
  
      setSelectedItems([]);
      setSelectedWeek(null);
      setSaveModelActive(false);
    }
  };

  const DeleteItem = (itemId) => {
    setWeeksData((prevWeeksData) => {
      const newWeeksData = [...prevWeeksData];

      newWeeksData.forEach((weekData, index) => {
        if (index !== 0 && weekData) {
          newWeeksData[index] = weekData.filter((item) => item.id !== itemId);
        }
      });

      return newWeeksData;
    });
  };

  const renderStars = (rating, max = 5) =>
    Array.from({ length: max }, (_, i) =>
      i < rating ? <Star key={i} /> : <StarBorder key={i} />
    );

  const renderWeeks = () =>
    Array.from({ length: 4 }, (_, i) => (
      <Button
        key={i}
        className={`mx-2 btn-light ${i === SelectedWeek && "active"}`}
        onClick={() => {
          SelectedWeek !== i ? setSelectedWeek(i) : setSelectedWeek(null);
        }}
      >
        Week {i + 1}
      </Button>
    ));

  useEffect(() => {
    getRecipes().then((result) => {
      setWeeksData((prevWeeksData) => {
        const newWeeksData = [...prevWeeksData];
        newWeeksData[0] = result.data["recipes"];
        return newWeeksData;
      });
    });
  }, []);

  return (
    <main>
      <header className="header position-relative d-flex align-items-center w-100">
        <img
          src={WeeksData[0].length > 0 ? WeeksData[0][0]["image"] : ""}
          alt=""
          className="header-image w-100"
        />
        <div className="header-content position-absolute d-flex justify-content-center align-items-center flex-column top-0 right-0 bottom-0 left-0 w-100">
          <h1>Optimized Your Meal</h1>
          <p>
            Select Meal to Add in Week. You will be able to edit, modify and
            change the Meal Weeks.
          </p>
        </div>
      </header>
      <section className="container mx-auto">
        <h2 className="my-3">Weeks</h2>
        <div className="d-flex justify-content-between align-items-center">
          <ul
            id="weeksTab"
            className="list-unstyled d-flex justify-content-around align-items-center w-75 pt-4"
          >
            {WeekTabs.map((tab, index) => (
              <li
                key={index}
                className={`theme-list-1 mb-4 ${
                  activeTab === index ? "active" : ""
                }`}
                onClick={() => handleTabClick(index)}
              >
                {tab}
              </li>
            ))}
          </ul>
          <Button
            className={`${SelectedItems.length > 0 ? "theme-btn-1" : "theme-btn-2"} mb-4 px-4 py-3`}
            onClick={() =>
              SelectedItems.length > 0 && setSaveModelActive(!SaveModelActive)
            }
          >
            Add to Week
          </Button>
        </div>
        <div className="row">
          {WeeksData[activeTab].map((recipe) => (
            <div
              key={recipe.id}
              id={`recipe-${recipe.id}`}
              onClick={(e) => {
                if (activeTab === 0) {
                  e.currentTarget.children[0].classList.toggle("active");
                  setSelectedItems((prevSelectedItems) =>
                    prevSelectedItems.includes(recipe.id)
                      ? prevSelectedItems.filter((id) => id !== recipe.id)
                      : [...prevSelectedItems, recipe.id]
                  );
                }
              }}
              className="col-lg-4 col-md-6 col-12 mb-4 mx-auto recipe position-relative"
            >
              <div className="recipe-card">
                <img
                  src={recipe.image}
                  alt={recipe.name}
                  className="recipe-image"
                />
                <div className="recipe-content d-flex justify-content-between flex-column">
                  <div>
                    <h3 className="recipe-title">{recipe.name}</h3>
                    <p className="recipe-description">
                      {recipe.instructions.join(" ")}
                    </p>
                  </div>
                  <div className="recipe-info d-flex justify-content-between">
                    <span>
                      <strong>Cuisine:</strong> {recipe.cuisine}
                    </span>
                    <span className="d-flex align-items-center">
                      <strong className="pe-1">Rating:</strong> {recipe.rating}{" "}
                      <span className="stars ps-2">
                        {renderStars(recipe.rating)}
                      </span>
                    </span>
                  </div>
                </div>
              </div>
              {activeTab !== 0 && (
                <span
                  className="position-absolute text-danger p-1"
                  style={{
                    backgroundColor: "#ffe0e0",
                    cursor: "pointer",
                    left: "10%",
                    top: "30px",
                  }}
                  onClick={()=>DeleteItem(recipe.id)}
                >
                  <DeleteOutlineOutlined />
                </span>
              )}
              <span
                className="position-absolute px-3 py-1 rounded bg-black text-white"
                style={{ top: "30px", right: "10%" }}
              >
                {recipe["mealType"] === String
                  ? recipe["mealType"]
                  : recipe["mealType"].join(", ")}
              </span>
            </div>
          ))}
        </div>
      </section>
      <section
        className={`select-week-model position-fixed ${
          SaveModelActive ? "d-flex" : "d-none"
        } align-items-center justify-content-center top-0 right-0 left-0 bottom-0 w-100`}
      >
        <div className="bg-white p-5 rounded">
          <h2>Select Week</h2>
          <div className="mt-3 mb-2">{renderWeeks()}</div>
          <div className="d-flex justify-content-center align-items-center">
            <Button
              className="text-center mx-auto mt-3 px-4 py-2"
              onClick={saveHandler}
            >
              Save
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}

export default App;
