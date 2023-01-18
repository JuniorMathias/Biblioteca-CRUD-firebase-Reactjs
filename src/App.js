import { useState, useEffect } from 'react';
import { db, auth } from './firebaseConnection';
import './app.css'
import { 
  doc, 
  setDoc, 
  collection, 
  addDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc,
  onSnapshot
} from 'firebase/firestore';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';

function App() {
  const [titulo, setTitulo] = useState('');
  const [autor, setAutor] = useState('');
  const [idPost, setIdPost] = useState('');
  const [post, setPosts] = useState([]);

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const [user, setUser] = useState(false);
  const [userDetail, setUserDetail] = useState({});


  useEffect(() => {
    async function loadPosts(){
      const unsub = onSnapshot(collection(db, "posts"), (snapshot) => {
        let listaPost = [];
        snapshot.forEach((doc) => {
          listaPost.push({
            id: doc.id,
            titulo: doc.data().titulo,
            autor: doc.data().autor,
          })
        })
        setPosts(listaPost);
      })
    }
    loadPosts();
  }, []);
  
  useEffect(() => {
    async function checkLogin(){
      onAuthStateChanged(auth, (user) => {
        if(user){
          setUser(true);
          setUserDetail({
            uid: user.uid,
          email: user.email,
          })
        }else{
          setUser(false);
          setUserDetail({});
        }
      })
    }
    checkLogin();
  },[])

  async function handleAdd(){
    // await setDoc(doc(db, "posts", "12345"), {
    //   titulo: titulo,
    //   autor: autor,
    // })
    // .then(() => {
    //   alert("Dados Registrados no Banco");
    // })
    // .catch((error) => {
    //   alert("Gerou Erro" + error);
    // })
    await addDoc(collection(db, "posts"), {
      titulo: titulo,
      autor: autor,
    })
    .then(() => {
        setAutor('');
        setTitulo('');
        alert("Dados Registrados no Banco");
      })
      .catch((error) => {
        alert("Gerou Erro" + error);
      })
    
  }
  async function buscarPost(){
    // const postRef = doc(db, "posts", "12345");
    // await getDoc(postRef)
    // .then((snapshot) =>{
    //   setAutor(snapshot.data().autor)
    //   setTitulo(snapshot.data().titulo)
    // })
    // .catch(() =>{
    //   alert("Erro ao buscar")
    // })
    const postRef = collection(db, "posts");
    await getDocs(postRef)
    .then((snapshot) => {
      let lista = [];
      snapshot.forEach((doc) => {
        lista.push({
          id: doc.id,
          titulo: doc.data().titulo,
          autor: doc.data().autor,
        })
      })
      setPosts(lista);
    })
    .catch((error) => {
      alert("Erro ao buscar");
    })
  }
  async function editarPost(){
    const docRef = doc(db, "posts", idPost);
    await updateDoc(docRef, {
      titulo: titulo,
      autor: autor
    })
    .then(() => {
      alert("POST ATUALIZADO");
      setIdPost('');
      setTitulo('');
      setAutor('');
    })
    .catch(() => {
      alert('deu error ao atualizar')
    })
    }
  async function excluirPost(id){
    const docRef = doc(db, "posts", id)
    await deleteDoc(docRef)
    .then(() => {
      alert("Deletado com sucessso");
    })
    .catch((error) => {
      alert("Erro ao Deletar" + error)
    })
  }
  async function novoUsuario(){
    await createUserWithEmailAndPassword(auth, email, senha)
    .then(() => {
      alert("CADASTRADO COM SUCESSO!")
    
      setEmail('');
      setSenha('');
    })
    .catch((error) => {
      
      if(error.code === 'auth/weak-password'){
        alert("Senha muito fraca.")
      }else if(error.code === 'auth/email-already-in-use'){
        alert("Email já existe!")
      }

    })
  }
  async function logarUsuario(){
    await signInWithEmailAndPassword(auth, email, senha)
    .then((value) => {
      alert("logado");
      setUserDetail({
        uid: value.user.uid,
        email: value.user.email,
      })

      setUser(true)

      setEmail('')
      setSenha('')
    })
    .catch((error) => {
      alert(error)
    })
  }
  async function fazerLogout(){
    await signOut(auth)
    setUser(false);
    setUserDetail({});
  }

  return (
    <div>
      
      { user && (
        <div> 
          <strong>seja bem-vindo você está logado</strong><br/>
          <span>ID: {userDetail.uid} - Email: {userDetail.email}</span>
          <br/><br/>
          <button onClick={fazerLogout}> Sair</button>
          <br/><br/>
        </div>
      )}

      <div className="container">
      <h2>Usuarios</h2>

      <label>Email</label>
      <input 
        value={email}
        onChange={(e) => setEmail(e.target.value)} 
        placeholder="Digite um email"
      /> <br/>

      <label>Senha</label>
      <input 
        value={senha}
        onChange={(e) => setSenha(e.target.value)} 
        placeholder="Informe sua senha"
      /> <br/> 

      <button onClick={novoUsuario}>Cadastrar</button> 
      <button onClick={logarUsuario}>Fazer Login</button>     
    </div>

    <br/><br/>
    <hr/>
    <h2>Posts</h2>
      <div className='container'>
      <label>ID do Post:</label><br/>
      <input
        placeholder='Digite o ID do Post'
        value={idPost}
        onChange={(e) => setIdPost(e.target.value)}
      />

        <label>Titulo:</label>
        <textarea 
          type="text"
          placeholder='Digite o Titulo'
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
        />

      <label>Autor</label>
      <input
        type="text"
        placeholder='Autor do Post'
        value={autor}
        onChange={(e) => setAutor(e.target.value)}
      />
      <button onClick={handleAdd}>Cadastrar</button>
      <button onClick={buscarPost}>Buscar</button><br/>
      <button onClick={editarPost}>Atualizar Post</button>

      <ul>
        {post.map((post) => {
          return(
            <li key={post.id}>
              <strong>ID: {post.id}</strong> <br/>
              <span>Titulo: {post.titulo}</span> <br/>
              <span>Autlor: {post.autor} </span> <br/>
              <button onClick={() => excluirPost(post.id)}>Excluir</button>
            </li>
          )
        })}
      </ul>
      </div>
    </div>
  );
}

export default App;
