import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { usuarioExistente } from "src/services/usuarios";
import { Usuario } from 'src/types/usuario';
import uuid from "react-native-uuid";
import server from 'assets/server';

interface LoginPayload {
  emailOuCpf: Usuario['cpf'] | Usuario['email'],
  senha: Usuario['senha']
}

interface InitialState {
  usuarioLogado: Usuario | undefined,
  usuarios: Usuario[],
}

const initialState: InitialState = {
  usuarioLogado: undefined,
  usuarios: server.usuarios
}

const usuarioSlice = createSlice({
  initialState,
  name: "usuario",
  reducers: {
    logar: (state, action: PayloadAction<LoginPayload>) => {
      const usuarioEncontrado = usuarioExistente(
        state.usuarios,
        action.payload.emailOuCpf,
        action.payload.senha
      );
      if(!usuarioEncontrado) throw new Error('Email/CPF ou senha incorretos');
      state.usuarioLogado = usuarioEncontrado;
    },
    deslogar: (state) => {
      state.usuarioLogado = undefined;
    },
    cadastrar: (state, action: PayloadAction<Omit<Usuario, 'id'>>) => {
      const id = uuid.v4();
      const novoUsuario = { ...action.payload, id };
      state.usuarios.push(novoUsuario);
      state.usuarioLogado = novoUsuario;
    },
    alterarUsuario: (state, action: PayloadAction<Partial<Usuario>>) => {
      Object.assign(state.usuarioLogado as Usuario, action.payload);
      const idAtual = state.usuarioLogado!.id;
      const index =
        state.usuarios.findIndex(usuario => usuario.id === idAtual);
      Object.assign(state.usuarios[index], action.payload);
    },
    excluirUsuario: (state, action: PayloadAction<Usuario['id']>) => {
      const novoArrayDeUsuarios = 
        state.usuarios.filter(usuario => usuario.id !== action.payload);
      state.usuarioLogado = undefined;
      state.usuarios = novoArrayDeUsuarios;
    }
  },
});

export const { logar, deslogar, cadastrar, alterarUsuario, excluirUsuario } = usuarioSlice.actions;

export default usuarioSlice.reducer;
