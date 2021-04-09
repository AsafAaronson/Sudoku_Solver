from Board import Board
import sys
from mock_boards import *

def board_input_handler(input_board,board):
    for i in range(9):
        for j in range(9):
            if input_board[i][j] == 0:
                board[i,j] = None
            else:
                board[i,j] = input_board[i][j]
    return board

def board_input_parser(arg):
    board = [[] for _ in range(9)]
    for i in range(9):
        for j in range(9):
            board[i].append(int(arg[2*(i*9+j)]))
    return board

def board_solver(board):
    print('"steps":[')
    while not (board.is_board_full() or board.bad_container_count >= 27):
        board.bad_container_count = 0
        for row in range(9):
            board.container_solver("row", row)
        for column in range(9):
            board.container_solver("column", column)
        for block in range(9):
            board.container_solver("block", block)
    print('{"step":0'+'}],')
    if board.bad_container_count >= 27:
        if not board.is_board_legal():
            for i in range(9):
                for j in range(9):
                    if not board[i,j]:
                        board[i,j] = 0
            return board
        else:
            board.backtracking_solver()
        print('"used_backtracking":true,')
    else:
        print('"used_backtracking":false,')
    return board

#create Empty Board
b = Board()
# Fill up board (will come from user input)
input_board = board_input_parser(sys.argv[1])
print('{')
b = board_input_handler(input_board,b)
solved = board_solver(b)
print('"result":'+ str(solved._board))
print('}')


