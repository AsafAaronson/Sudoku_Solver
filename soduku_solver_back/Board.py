import itertools


class Board:
    def __init__(self):  # creates a list consisting 9 lists, each consisting of 9 slots- by default each slot = None
        self._board = [[None for i in range(9)] for j in range(9)]
        self.bad_container_count = 0  # counts consequtive containers that passed unsuccefully
        self.steps_count = 0  # counts steps done

    def __str__(self):
        # instance representation: each row printed separately divided by \n (using _row_str) to build each row
        return '- ' + ' -\n- '.join(self._row_str(row) for row in self._board) + ' -'

    # use "instance[x,y]" to call an a slot on the board
    def __getitem__(self, key):
        y, x = key
        return self._board[y][x]

    # allows using "instance[x,y] = value" to assign a new value
    def __setitem__(self, key, value):
        y, x = key
        self._board[y][x] = value

    @staticmethod
    def coordinates_gen():
        for y, x in itertools.product(range(9), range(9)):
            yield y, x

    @staticmethod
    def _row_str(row):
        # takes a given row list and (using a generator) returns a string --(each element as a str divided by " | ")
        elements = (
            str(element) if element is not None else ' ' for element in row)
        # elements = []
        # for element in row:
        #     if element is None:
        #         elements.append(' ')
        #     else:
        #         elements.append(element)
        return ' | '.join(elements)

    @staticmethod
    def _block_method(index):
        # takes an index (0-8) and returns the all the coordinates in the inex-th block as a generator
        # (y as row, x as column)
        starting_x = (index % 3) * 3
        starting_y = (index // 3) * 3
        end_x = starting_x + 3
        end_y = starting_y + 3
        for x, y in itertools.product(range(starting_x, end_x), range(starting_y, end_y)):
            yield x, y

    @staticmethod
    def num_counter(sets):
        num_quantities = {}
        for i in range(1, 10):
            count = 0
            for t in sets:
                if i in sets[t]:
                    count += 1
            num_quantities[i] = count
        return num_quantities

    @staticmethod
    # checks the coordinates of the slot that has wanted as a valid num
    def which_slot(valid_num_dict, wanted):
        y, x = None, None
        for coordinates in valid_num_dict:
            if wanted in valid_num_dict[coordinates]:
                y, x = coordinates
        return y, x

    def is_board_full(self):
        x = True
        for row in self._board:
            if None in row:
                x = False
        return x

    def is_board_legal(self):
        x = True
        for i in range(9):
            temp_row = [n for n in self.get_row(i) if not n == None]
            if not len(set(temp_row)) == len(temp_row):
                x = False
            temp_col = [n for n in self.get_column(i) if not n == None]
            if not len(set(temp_col)) == len(temp_col):
                x = False
            temp_block = [n for n in self.get_block(i) if not n == None]
            if not len(set(temp_block)) == len(temp_block):
                x = False
        return x

    def get_row(self, index):  # returns the items (as generator) in the row in the index-th place (0-8)
        return (num for num in self._board[index])

    # returns the items (as generator) in the column in the index-th place (0-8)
    def get_column(self, index):
        return (row[index] for row in self._board)

    def get_block(self, index):
        # returns the items (as generator) in the block in the index-th place (0-8) using "_block_method"
        return (self._board[y][x] for x, y in self._block_method(index))

    # returns the items (as generator) in the row in the index-th place (0-8)
    def get_row_coordinates(self, index):
        return ((index, i) for i in range(9))

    def get_column_coordinates(self, index):
        # returns the items (as generator) in the column in the index-th place (0-8)
        return ((i, index) for i in range(9))

    def get_block_coordinates(self, index):
        # returns the items (as generator) in the block in the index-th place (0-8) using "_block_method"
        return ((y, x) for x, y in self._block_method(index))

    def which_block(self, y, x):
        # takes coordinates (row, column) and returns which block (0-8) it belongs to
        for i in range(9):
            if (x, y) in self._block_method(i):
                return i

    def present_in_container(self, container_type, index):
        # takes the "row"/"column"/"block" in the n-th place and returns the items in a list
        container_funs = {"row": self.get_row(index), "column": self.get_column(
            index), "block": self.get_block(index)}
        if container_type not in container_funs:
            return "Thats not a type of container"
        present_in_container = []
        for x in container_funs[container_type]:
            present_in_container.append(x)
        return present_in_container

    def missing_in_container(self, container_type, index):
        in_container = self.present_in_container(container_type, index)
        return set(range(1, 10)).difference(set(in_container))

    def valids_in_slot(self, y, x):  # returns what numbers are valid in a given slot
        if self._board[y][x] is None:
            m_in_row = self.missing_in_container("row", y)
            m_in_column = self.missing_in_container("column", x)
            m_in_block = self.missing_in_container(
                "block", self.which_block(y, x))
            return m_in_row.intersection(m_in_column, m_in_block)
        else:
            return set()

    def valids_for_slot_in_conatiner(self, container_type, index):
        # returns a dictionary with 9 key-value pairs (tuple- slot coordinate, set - valid digits for the slot)
        temp = {}
        container_funs = {"row": self.get_row_coordinates(index), "column": self.get_column_coordinates(index),
                          "block": self.get_block_coordinates(index)}
        if container_type not in container_funs:
            raise ValueError('Expected "row", "column", or "block"')
        else:
            for y, x in container_funs[container_type]:
                temp[y, x] = (self.valids_in_slot(y, x))
        return temp

    def backtracking_solver(self, i=0, j=0):
        if self[i, j] == None:
            slot_options = list(
                self.valids_for_slot_in_conatiner("row", i)[(i, j)])
            if len(slot_options) != 0:
                for op in slot_options:
                    cloned_self = self
                    cloned_self[i, j] = op
                    if i == 8 and j == 8:
                        return cloned_self
                    elif j == 8:
                        branch = (cloned_self.backtracking_solver(i+1, 0))
                        if not branch:
                            cloned_self[i, j] = None
                        else:
                            return branch
                    else:
                        branch = (cloned_self.backtracking_solver(i, j+1))
                        if not branch:
                            cloned_self[i, j] = None
                        else:
                            return branch
        else:
            if i == 8 and j == 8:
                return self
            elif j == 8:
                return (self.backtracking_solver(i+1, 0))
            else:
                return (self.backtracking_solver(i, j+1))

    def container_solver(self, container_type, index):
        counter = 0
        valid_options = self.valids_for_slot_in_conatiner(
            container_type, index)
        for slot in valid_options:
            if len(valid_options[slot]) == 1:
                self[slot] = next(iter(valid_options[slot]))
                self.steps_count += 1
                print('{'+'"step":{},'.format(self.steps_count) + '"slot":{},'.format(list(slot)) +
                      '"digit":{},'.format(self[slot]) + '"bcc":{}'.format(self.bad_container_count) + '},')
            else:
                counter += 1
        counted_nums = self.num_counter(valid_options)
        for digit in counted_nums:
            slot = self.which_slot(valid_options, digit)
            if (counted_nums[digit] == 1) and (self[slot] == None):
                self[slot] = digit
                self.steps_count += 1
                print('{'+'"step":{},'.format(self.steps_count) + '"slot":{},'.format(list(slot)) +
                      '"digit":{},'.format(digit) + '"bcc":{}'.format(self.bad_container_count) + '},')
            else:
                counter += 1

        # is container bad (update bad_container_count accordingly)
        if counter == len(valid_options) + len(counted_nums):
            self.bad_container_count += 1
        else:
            self.bad_container_count = 0
