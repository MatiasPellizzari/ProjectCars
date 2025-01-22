class Driver:
        def __init__(self,name,score,city,besttime):
            self.name = name
            self.score = score
            self.city = city
            self.besttime = float(besttime)

        def updatebesttime(self, new_besttime):
            if isinstance(new_besttime, (int, float)):
                self.besttime = float(new_besttime)
            else:
                raise ValueError("Best time must be a number")