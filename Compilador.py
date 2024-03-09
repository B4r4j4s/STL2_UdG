import tkinter as tk
from tkinter import ttk
import pandas as pd
import os







simbolos = [
    'identificador',
    'entero',
    'real',
    'cadena',
    'tipo',  # int, float, void
    'opSuma',  # +, -
    'opMul',  # *, /
    'opRelac',  # <, <=, >, >=
    'opOr',  # ||
    'opAnd',  # &&
    'opNot',  # !
    'opIgualdad',  # ==, !=
    ';',
    ',',
    '(',
    ')',
    '{',
    '}',
    '=',
    'if',
    'while',
    'return',
    'else',
    '$'
]

def lexer(cad):
    tokens = []
    linetracker = 0
    ParentesisFlag = 0
    LlavesFlag = 0
    index = 0
    char = ''
    print(cad)
    print(len(cad))
    while index < len(cad):
        char = cad[index]
        

        # Ignorar espacios en blanco
        if char == ' ' or char == '\t':
            index += 1
            continue

        # Contar los saltos de linea
        elif char == '\n':
            index += 1
            linetracker += 1
            continue

        # Identificadores
        elif char.isalpha() or char == '_':
            word = ''
            while (char.isalpha() or char.isdigit()) and index < len(cad):
                word += char
                index += 1
                char = cad[index]
                
            if word == 'if':
                tokens.append({'type': 19, 'value': word})
                continue
            elif word == 'while':
                tokens.append({'type': 20, 'value': word})
                continue
            elif word == 'return':
                tokens.append({'type': 21, 'value': word})
                continue
            elif word == 'else':
                # marcar error si no hay if antes
                tokens.append({'type': 22, 'value': word})
                continue

            tokens.append({'type': 0, 'value': word})
            print(tokens)
            continue

        # Cadena
        elif char == "\"":
            word = cad[index]
            index += 1
            while cad[index] not in ("\"", "\n") and index < len(cad):
                word += cad[index]
                index += 1

            if cad[index] == "\"":
                tokens.append({'type': 3, 'value': word + cad[index]})
                index += 1
                continue
            else:
                print('error de lexico')
                # Manejar el error léxico según sea necesario

        # Numero Flotante y Entero
        elif char.isdigit():
            number = ''
            while char.isdigit() and index < len(cad):
                number += char
                index += 1
                char = cad[index]

            if cad[index] == '.':
                number += cad[index]
                index += 1
                if cad[index].isdigit():
                    while cad[index].isdigit() and index < len(cad):
                        number +=cad[index]
                        index += 1
                    tokens.append({'type': 2, 'value': number})
                    continue
                else:
                    # tokens.append({'type': 'Error', 'value': number})
                    printError("Error en la línea " + str(linetracker) + ": '" + number + "'.")
                    continue

            tokens.append({'type': 1, 'value': number})
            continue

        # operador + | -
        elif char in ['+', '-']:
            tokens.append({'type': 5, 'value': char})
            index += 1
            continue

        # operador * | /
        elif char in ['*', '/']:
            tokens.append({'type': 6, 'value': char})
            index += 1
            continue

        # asignacion
        if char == '=':
            if cad[index + 1] == '=':
                tokens.append({'type': 11, 'value': char + cad[index + 1]})
                index += 2
                continue
            tokens.append({'type': 18, 'value': char})
            index += 1
            continue

        # Relacional
        if char in ['<', '>']:
            rel = char
            if cad[index + 1] == '=':
                rel += cad[index + 1]
                index += 2
            tokens.append({'type': 7, 'value': rel})
            index += 1
            continue

        if char == '!':
            if cad[index + 1] == '=':
                tokens.append({'type': 11, 'value': char + cad[index + 1]})
                index += 2
                continue
            tokens.append({'type': 10, 'value': char})
            index += 1
            continue

        # And
        if char + cad[index + 1] == '&&':
            tokens.append({'type': 9, 'value': char + cad[index + 1]})
            index += 2
            continue

        # Or
        if char == '|' and cad[index + 1] == '|':
            tokens.append({'type': 8, 'value': char +cad[index + 1]})
            index += 2
            continue

        # Punto y coma
        if char == ';':
            tokens.append({'type': 12, 'value': char})
            index += 1
            continue

        # Parentesis
        if char == '(':
            ParentesisFlag += 1
            tokens.append({'type': 14, 'value': char})
            index += 1
            continue
        if char == ')':
            ParentesisFlag -= 1
            tokens.append({'type': 15, 'value': char})
            index += 1
            continue

        # Llaves
        if char == '{':
            LlavesFlag += 1
            tokens.append({'type': 16, 'value': char})
            index += 1
            continue
        if char == '}':
            LlavesFlag -= 1
            tokens.append({'type': 17, 'value': char})
            index += 1
            continue

        # Llaves
        if char == '$':
            tokens.append({'type': 23, 'value': char})
            index += 1
            continue

        index += 1

    return tokens

def printError(message):
    print("\033[91m" + message + "\033[0m")


data_frame = pd.read_csv('STL2_UdG/data/compiladorTabla.csv')

class LR1Parser:
    def __init__(self, gramatica):
        self.gramatica = gramatica
        self.pila = []
        self.entrada = []
        self.aceptacion = False

    def analizar(self, entrada):
        self.entrada = entrada + ['$']
        self.pila = [0]
        idx = 0

        while True:
            estado_actual = self.pila[-1]
            simbolo_actual = self.entrada[idx]

            accion = self.gramatica[estado_actual].get(simbolo_actual, None)

            if accion is None:
                break

            if accion[0] == 'd':# Desplazamiento
                
                self.pila.append(simbolo_actual)
                self.pila.append(int(accion[1:]))
                idx += 1
            elif accion[0] == 'r':# Reducción
                regla = int(accion[1:])
                longitud = len(self.gramatica[regla]['cuerpo'])

                for _ in range(2 * longitud):
                    self.pila.pop()

                simbolo_no_terminal = self.gramatica[regla]['encabezado']
                nuevo_estado = self.gramatica[self.pila[-1]][simbolo_no_terminal]
                self.pila.append(simbolo_no_terminal)
                self.pila.append(nuevo_estado)
            elif accion == 'acc':# Aceptación
                self.aceptacion = True
                break

        if self.aceptacion:
            print("Aceptación")
        else:
            print("Entrada inválida")



entrada = ['a', 'b', 'a', 'b', '$']

parser = LR1Parser(gramatica)
parser.analizar(entrada)


class CompGUI:
    def __init__(self, root):
        root.title("CompGUI")
        root.geometry("800x500")
        root.configure(bg="#d9d9d9")

        # Frame izquierdo con input y botón
        if 1==1:
            left_frame = tk.Frame(root, bg="#d9d9d9")
            left_frame.grid(row=0, column=0, sticky="nsew")

            self.input_entry = tk.Entry(left_frame, width=40)
            self.input_entry.grid(row=0, column=0, padx=10, pady=10)

            button = tk.Button(left_frame, text="Analizar", command=self.analyze)
            button.grid(row=1, column=0, padx=10, pady=10)

        # Frame derecho con Treeview (tokenTree)
        if 2==2:
            token_tree_frame = tk.Frame(root, bg="#d9d9d9")
            token_tree_frame.grid(row=0, column=1, sticky="nsew")

            token_tree = ttk.Treeview(token_tree_frame, columns=("Token", "Valor", "Lexema"), show="headings")
            token_tree.heading("Token", text="Token")
            token_tree.heading("Valor", text="Valor")
            token_tree.heading("Lexema", text="Lexema")
            column_width = 110
            token_tree.column("Token", width=column_width)
            token_tree.column("Valor", width=column_width)
            token_tree.column("Lexema", width=column_width)
            token_tree.grid(row=0, column=0, padx=10, pady=10)

        # Frame abajo con Treeview (ruleTree)
        if 3==2:
            rule_tree_frame = tk.Frame(root, bg="#d9d9d9")
            rule_tree_frame.grid(row=1, column=0, sticky="nsew")

            rule_tree = ttk.Treeview(rule_tree_frame, columns=("Número", "Regla"), show="headings")
            rule_tree.heading("Número", text="Número")
            rule_tree.heading("Regla", text="Regla")
            rule_tree.grid(row=0, column=0, padx=10, pady=10, columnspan=2)

        # Configurar columnas expansibles
        root.grid_rowconfigure(0, weight=1)
        root.grid_columnconfigure(1, weight=1)

        # Puedes agregar más configuraciones y funciones según sea necesario

    def analyze(self):
        input = self.input_entry.get()
        tokenData = lexer(input)
        for data in tokenData:
             self.token_tree.insert("", "end", values=(simbolos[data["type"]], data["type"], data["value"]))
        

if __name__ == "__main__":
    print(lexer('var2 12'))

