# Libraries
import json, tkinter as tk

# Classes
from src.clue import Clue

class CrosswordBuilder():
	def __init__(
			self,
			debug=False
		):
		root = tk.Tk()
		self.root = root
		self.root.title("Crossword Builder")
		self.grid_size = 4 # default size

		# Frame
		self.grid_frame = tk.Frame(self.root)
		self.grid_frame.pack()

		self.control_frame = tk.Frame(self.root)
		self.control_frame.pack(pady=10)

		# Debug matrix
		self.debug = debug
		self.debug_matrix = [
			["JET", None, "ATONED", None, None, "INS"],
			["IRE", None, "MEGAMAN", None, "MET"],
			["MONSTERSINC", None, "PGA"],
			["MINI", None, "MEH", None, "DOTORG"],
			["ICING", None, None, "USE", None, "ALOE"],
			["EASEL", None, "BALLERINA"],
			[None, None, None, "WACO", None, "EIDETIC"],
			["TSP", None, "DAN", None, "DOW", None, "EST"],
			["ACOLYTE", None, "GNAW", None, None, None],
			["PALESTINE", None, "ROVES"],
			["ALLA", None, "RNA", None, None, "DOILY"],
			["SLOFIE", None, "IDK", None, "LOPS"],
			["BIC", None, "FALLINGFLAT"],
			["AOK", None, "STEERED", None, "ESE"],
			["RNS", None, None, "STREEP", None, "TOM"]
		]

		self.entries = self.build_grid()
		
		self.entries[0][0].focus_set()

		self.build_across = tk.BooleanVar(value=True) # Default to across
		self.build_controls()

		# List of clues to be made on export
		self.clues = []

		# For prompt updating
		self.prompt_index = 0

		# Disable flag
		self.disabled = False

		# Prompts filled flag
		self.prompts_added = False

		# Launch
		self.root.mainloop()
		return
	
	# Builds grid
	def build_grid(self):
		grid = []

		# Fresh start
		if not self.debug:
			for r in range(self.grid_size):
				row_entries = []
				for c in range(self.grid_size):
					entry = self.create_entry(r, c)
					row_entries.append(entry)
				grid.append(row_entries)
		
		# For debug
		if self.debug:
			for rownum in range(len(self.debug_matrix)):
				row_entries = []
				index = 0
				for word in self.debug_matrix[rownum]:
					if not word:
						entry = self.create_entry(rownum, index)
						row_entries.append(entry)
						index+=1
						continue
					
					for letter in word:
						entry = self.create_entry(rownum, index, letter)
						row_entries.append(entry)
						index+=1
				grid.append(row_entries)
		return grid

	# Creates entry tile
	def create_entry(self, r, c, text=None):
		entry = tk.Entry(self.grid_frame,
			width=2,
			font=('Arial', 18),
			justify='center',
			fg='white',
			bg='black',
			insertbackground='white'
		)
		
		# Grids
		entry.grid(row=r, column=c, padx=1, pady=1)
		entry.row = r
		entry.col = c

		# Bind Enter key
		entry.bind("<Return>", lambda e, row=r, col=c: self.enter_key(row, col))
		
		# Bind arrow keys
		entry.bind("<Up>", lambda e, row=r, col=c: self.arrow_key(row - 1, col))
		entry.bind("<Down>", lambda e, row=r, col=c: self.arrow_key(row + 1, col))
		entry.bind("<Left>", lambda e, row=r, col=c: self.arrow_key(row, col - 1))
		entry.bind("<Right>", lambda e, row=r, col=c: self.arrow_key(row, col + 1))

		# Spacebar & tab
		entry.bind("<space>", lambda e, ent=entry, row=r, col=c: self.spacebar(entry, row, col))
		entry.bind("<Tab>", lambda e, ent=entry, row=r, col=c: self.spacebar(entry, row, col))

		# Bind key release to update style when a letter is typed
		entry.bind("<KeyRelease>", lambda e, ent=entry, row=r, col=c: self.key_release(e, ent, row, col))

		# Handle backspace
		entry.bind("<BackSpace>", lambda e, ent=entry, row=r, col=c: self.handle_backspace(entry, row, col))

		# Adds text
		if text:
			entry.insert(0, text)
			entry.config(bg='white', fg='black', insertbackground='black')
	
		return entry

	# Hanldes key release
	def key_release(self, event, entry, row, col):
		# Check shift press
		if event.state & 0x0001: 
			self.toggle_build_across()

		# Return on non-letter input
		key = event.char.upper()
		if not key.isalpha():
			return
		
		# Lettered keys
		self.set_text(event, entry, row, col, key)
		if self.build_across.get():
			self.move_cursor(row, col+1) # assume move right
		else:
			self.move_cursor(row+1, col)
		return

	# Handles enter key
	def enter_key(self, row, col):
		self.move_cursor(row+1, 0)
		return

	# Handles arrow keys
	def arrow_key(self, row, col):
		self.move_cursor(row, col)
		return

	# Handles spacebar, tab
	def spacebar(self, entry, row, col):
		if self.build_across.get():
			self.move_cursor(row, col+1)
		else:
			self.move_cursor(row+1, col)
		return "break" # prevents default space insertion

	# Shift-key toggle
	def toggle_build_across(self):
		self.build_across.set(not self.build_across.get())
		return

	# Moves cursor (considers boundaries)
	def move_cursor(self, rrow, rcol): #requested row, requested col
		# Stores max vals
		maxrow = len(self.entries)
		maxcol = len(self.entries[0])

		# Sets cursor coords
		# print(f"Requesting: {rrow}, {rcol}")
		if rcol > maxcol-1:
			# cursor right on right-edge
			rrow = 0 if rrow+1==maxrow else rrow+1
			rcol = 0
		elif rcol < 0:
			# cursor left on left-edge
			rrow = maxrow-1 if rrow-1 < 0 else rrow-1
			rcol = maxcol-1
		elif rrow == maxrow:
			# cursor down on bottom-edge
			rrow = 0
		elif rrow < 0:
			# cursor up on top-edge
			rrow = maxrow-1
	
		# print(f"Setting: {rrow}, {rcol}")
		 # Update cursor
		self.entries[rrow][rcol].focus_set()
		return [rrow, rcol]

	# Handles backspace
	def handle_backspace(self, entry, row, col):
		# Existing text in current entry
		if entry.get().strip():
			entry.delete(0, tk.END) # delete letter 
			entry.config(bg='black', fg='white', insertbackground='white') # reset (for boundary)
			return
		
		# Currently pointing to empty entry
		if self.build_across.get():
			coords = self.move_cursor(row, col-1)
		else:
			coords = self.move_cursor(row-1, col)
		entry = self.entries[coords[0]][coords[1]]
		entry.delete(0, tk.END) # delete letter 
		entry.config(bg='black', fg='white', insertbackground='white') # reset format
		return

	# Updates entry tile
	def set_text(self, event, entry, row, col, key):
		# Updates value
		entry.delete(0, tk.END)
		entry.insert(0, key)
		
		# Updates style
		if entry.get().strip():
			entry.config(bg='white', fg='black', insertbackground='black')
		else:
			entry.config(bg='black', fg='white', insertbackground='white')
		return

	# Build controls; packs onto GUI
	def build_controls(self):
		tk.Button(self.control_frame, text="Add Row + Col", command=self.grow_grid).pack(side='left', padx=5)
		tk.Button(self.control_frame, text="Shrink Row + col", command=self.shrink_grid).pack(side='left', padx=5)
		tk.Checkbutton(
			self.control_frame,
			text="[T/F] Across/Down (Shift)",
			variable=self.build_across,
			onvalue=True,
			offvalue=False
		).pack(side='left', padx=5)
		tk.Button(self.control_frame, text="Add Prompts/Edit", command=self.add_prompts).pack(side="bottom", padx=5)
		return

	# Add row + col
	def grow_grid(self):
		if len(self.entries[0]) > 20:
			return  # Max size reached

		currowcount = len(self.entries)
		curcolcount = len(self.entries[0])

		# Adds news column to exisiting rows
		for r in range(currowcount):
			entry = self.create_entry(r, curcolcount)
			self.entries[r].append(entry)

		# Adds new row to grid
		newrow = []
		for c in range(curcolcount+1):
			entry = self.create_entry(curcolcount, c)
			newrow.append(entry)
		self.entries.append(newrow)

		# Updates grid size
		self.grid_size = len(self.entries)
		return

	# Shrink row + col
	def shrink_grid(self):

		if len(self.entries[0]) <= 4:
			return  # Max size reached

		# Removes bottom row
		for entry in self.entries[-1]:
			entry.destroy()
		self.entries.pop()

		# Truncates each row by 1
		for row in self.entries:
			last_entry = row.pop()
			last_entry.destroy()

		# Updates grid_size
		self.grid_size = len(self.entries)
		return

	# Toggles edit for grid entries
	def set_disabled(self, editable:bool):
		for row in self.entries:
			for entry in row:
				try:
					if editable:
						self.disabled = False
						if entry.get():
							entry.config(state="normal", bg="white", fg="black", insertbackground="black")
						else:
							entry.config(state="normal", bg="black", fg="white", insertbackground="white")
						self.prompt_frame.destroy()
					else:
						self.disabled = True
						entry.config(state="disabled")
				except:
					pass # Handles NONE spaces
		return

	# Opents prompt window to add descriptorsn
	def add_prompts(self):
		if self.disabled:
			self.set_disabled(editable=True)
			self.prompt_index = 0
		else: 
			self.get_across_clues()
			self.get_down_clues()
			self.set_disabled(editable=False)
			self.open_prompt_window()
		return
	
	# Iterates over self.entries to get the origin points and across words
	def get_across_clues(self):
		for row in self.entries:
			word, origin= "", ""
			for entry in row:
				if not entry.get():
					if word:
						self.clues.append(Clue(word=word, origin=origin, orient="across"))
						word, origin, orient = "", "", ""
				else:
					word += entry.get()
					if not origin: origin=[entry.row, entry.col]

			#edge-case
			if word: self.clues.append(Clue(word=word, origin=origin, orient="across"))
		return
	
	# Transposes self.entries and iterates to find
	def get_down_clues(self):
		num_col = len(self.entries[0])
		num_row = len(self.entries)
		for c in range(num_col):
			word, origin = "", ""
			for r in range(num_row):
				entry = self.entries[r][c]
				if not entry.get():
					if word:
						self.clues.append(Clue(word=word, origin=origin, orient="down"))
						word, origin = "", ""
				else:
					word += entry.get()
					if not origin: origin = [r,c]
		
		#edge-case
		if word: self.clues.append(Clue(word=word, origin=origin, orient="down"))
		return

	# Prompts user to add descriptois to clues
	def open_prompt_window(self):
		# Initializes index
		# if not hasattr(self, 'prompt_index'):
			# self.prompt_index = 0
		
		# Clears previous frame
		if hasattr(self, 'prompt_frame'):
			self.prompt_frame.destroy()

		# Tk gui with textbox field. Above field include clue from self.clues and origin
		self.prompt_frame = tk.Frame(self.root)
		self.prompt_frame.pack(pady=10)

		# If all clues are done
		if self.prompt_index >= len(self.clues):
			return

		# Current clue
		clue = self.clues[self.prompt_index]
		labelinfo = f"{clue.orient.upper()} at {clue.origin}: {clue.word}"
		tk.Label(self.prompt_frame, text=labelinfo, font=('Arial', 14)).pack()			

		# Entry field
		prompt_entry = tk.Entry(self.prompt_frame, width=50, font=('Arial', 12))
		prompt_entry.pack(pady=5)
		prompt_entry.focus_set() # Sets cursor
		if clue.prompt:
			prompt_entry.insert(0, clue.prompt)

		# Submit button
		def submit_prompt(button):
				text = prompt_entry.get().strip()
				if text:
						clue.set_prompt(text)
						self.prompt_index += 1
						self.open_prompt_window()  # Load next clue

		# Bind Enter key
		prompt_entry.bind("<Return>", submit_prompt)
		tk.Button(self.prompt_frame, text="Submit Prompt", command=submit_prompt).pack()
		return