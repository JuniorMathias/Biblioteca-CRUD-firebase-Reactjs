import { db } from './firebaseConnection';
import './app.css'
import { useState, useEffect } from 'react';
import { doc,collection, addDoc, getDocs, updateDoc, deleteDoc, onSnapshot  } from 'firebase/firestore';

function App() {
  const [titulo, setTitulo] = useState('');
  const [autor, setAutor] = useState('');
  const [idPost, setIdPost] = useState('');
  const [post, setPosts] = useState([]);
  const [mostrarConteudo, setMostrarConteudo] = useState(false)
  
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

  async function handleAdd(){
    await addDoc(collection(db, "posts"), {
      titulo: titulo,
      autor: autor,
    })
    .then(() => {
        if(titulo.length === 0  && autor.length === 0){
          alert("vazio");
        }else{
          setAutor('');
          setTitulo('');
          alert("Dados Registrados no Banco");
        }
        
      })
      .catch((error) => {
        alert("Gerou Erro" + error);
      })
    
  }
  async function buscarPost(){
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
      setMostrarConteudo(true)
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
  return (
    <div className='global'>
      
      <div className='container'>
      <div className='inputs'>
      
      <h2>Biblioteca Online</h2>  
      { mostrarConteudo ?
      <>
      <label>ID do Livro:</label>
      <input
        placeholder='Digite o ID do Livro'
        value={idPost}
        onChange={(e) => setIdPost(e.target.value)}
      /><br/>
      </>
      : null }

        <label>Titulo do Livro:</label>
        <input 
          type="text"
          placeholder='Digite o Titulo'
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
        /><br/>

      <label>Autor do Livro</label><br/>
      
      <input
        type="text"
        placeholder='Autor do Livro'
        value={autor}
        onChange={(e) => setAutor(e.target.value)}
      /><br/>
      </div>
      
      <div className='buttons'>
      <button onClick={handleAdd}>Cadastrar</button>
      <button onClick={buscarPost}>Buscar</button>
      <button onClick={editarPost}>Atualizar Livro</button>
      </div>
    { mostrarConteudo ?
      <div className='resultados'>
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
      : null }
      </div>
    </div>
  );
}

export default App;
