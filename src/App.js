import { db } from './firebaseConnection';
import './app.css'
import { useState } from 'react';
import { doc, setDoc, collection, addDoc, getDoc, getDocs, updateDoc, deleteDoc } from 'firebase/firestore';

function App() {
  const [titulo, setTitulo] = useState('');
  const [autor, setAutor] = useState('');
  const [idPost, setIdPost] = useState('');
  const [post, setPosts] = useState([]);


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
  return (
    <div>
      <h2>hello world</h2>
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
