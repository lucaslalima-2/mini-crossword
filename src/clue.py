"""
Defines clue class for crossword_builder export
"""

class Clue:
	def __init__(
			self,
			word:str="",
			origin:list=[],
			orient:str=""
	):
		self.word = word
		self.origin = origin
		self.orient = orient
		self.prompt = ""
		return

	def set_prompt(self, text):
		self.prompt = text
		return

	def __str__(self):
		return f"{self.origin} ({self.orient}): {self.word}"