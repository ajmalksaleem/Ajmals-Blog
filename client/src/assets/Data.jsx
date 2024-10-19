
   export const carBodyTypes = [
        "Hatchback",
        "Sedan",
        "SUV",
        "Truck",
        "MPV",
        "Crossover",
        "Coupe",
        "Convertible",
        "Wagon",
        "Minivan",
        "Pickup Truck",
        "Van",
      ].map((type) => ({
        id: Math.floor(Math.random() * 1000),
        type,
      }));


export default carBodyTypes