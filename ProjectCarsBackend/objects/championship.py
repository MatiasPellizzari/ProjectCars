from driver import Driver


class Championship:
    def __init__(self,name,category):
        self.drivers = []  
        self.name = name
        self.category = category

    def add_driver(self, driver):
        if isinstance(driver, Driver):
            self.drivers.append(driver)
        else:
            raise ValueError("Only instances of the Driver class can be added")

    def get_all_drivers(self):
        return self.drivers

    def find_driver_by_name(self, name):
        for driver in self.drivers:
            if driver.name == name:
                return driver
        return None  

    def display_drivers(self):
        if not self.drivers:
            print("No drivers in the championship.")
            return
        for driver in self.drivers:
            print(f"Name: {driver.name}, City: {driver.city}, Best Time: {driver.besttime}")