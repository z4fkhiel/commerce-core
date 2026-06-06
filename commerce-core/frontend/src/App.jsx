import { useState, useEffect } from 'react';

// Estilos
const styles = {
  container: { fontFamily:'Segoe UI, sans-serif', background:'#f4f4f4', minHeight:'100vh', display:'flex', justifyContent:'center', alignItems:'center' },
  dashboard: { width:'1000px', margin:'20px' },
  authBox: { background:'white', padding:'40px', borderRadius:'8px', boxShadow:'0 4px 10px rgba(0,0,0,0.1)', width:'350px' },
  input: { display:'block', width:'100%', padding:'10px', marginBottom:'15px', borderRadius:'4px', border:'1px solid #ddd', boxSizing:'border-box' },
  btn: { width:'100%', padding:'10px', background:'#007bff', color:'white', border:'none', borderRadius:'4px', cursor:'pointer', fontWeight:'bold' },
  header: { background:'#222', color:'white', padding:'15px', display:'flex', justifyContent:'space-between', borderRadius:'8px' },
  grid: { display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(200px, 1fr))', gap:'20px', marginTop:'20px' },
  card: { background:'white', padding:'15px', borderRadius:'8px', boxShadow:'0 2px 4px rgba(0,0,0,0.05)', textAlign:'center' },
  cart: { background:'white', padding:'20px', marginTop:'20px', borderRadius:'8px' }
};

const API = "http://localhost:8080/api";

function App() {
  const [user, setUser] = useState(null);
  const [view, setView] = useState('login');

  useEffect(() => {
    const s = localStorage.getItem('shop_user');
    if(s) setUser(JSON.parse(s));
  }, []);

  const login = (u) => { setUser(u); localStorage.setItem('shop_user', JSON.stringify(u)); }
  const logout = () => { setUser(null); localStorage.removeItem('shop_user'); setView('login'); }

  if (!user) return (
    <div style={styles.container}>
      <div style={styles.authBox}>
         <h2 style={{textAlign:'center', marginTop:0}}>{view==='login'?'Entrar':'Registrarse'}</h2>
         <Auth view={view} onLog={login}/>
         <p style={{textAlign:'center', marginTop:'15px', color:'blue', cursor:'pointer'}} onClick={()=>setView(view==='login'?'register':'login')}>
           {view==='login'?'¿No tienes cuenta? Registrate':'¿Ya tienes cuenta? Ingresa'}
         </p>
      </div>
    </div>
  );

  return <Dash user={user} onOut={logout} />;
}

function Auth({view, onLog}) {
  const [form, setF] = useState({name:'', email:'', password:''});
  const change = (e) => setF({...form, [e.target.name]: e.target.value});

  const submit = async (e) => {
    e.preventDefault();
    const url = view==='login' ? '/auth/login' : '/auth/register';
    try {
      const res = await fetch(API + url, {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(form)});
      if(res.ok) onLog(await res.json());
      else alert('Error: Credenciales invalidas o email duplicado');
    } catch(err) { alert('No se pudo conectar al servidor'); }
  }

  return (
    <form onSubmit={submit}>
      {view==='register' && <input style={styles.input} name="name" placeholder="Nombre" onChange={change} required/>}
      <input style={styles.input} name="email" type="email" placeholder="Correo" onChange={change} required/>
      <input style={styles.input} name="password" type="password" placeholder="Contraseña" onChange={change} required/>
      <button style={styles.btn}>{view==='login'?'INGRESAR':'CREAR CUENTA'}</button>
    </form>
  )
}

function Dash({user, onOut}) {
  const [prods, setProds] = useState([]);
  const [me, setMe] = useState(user);

  useEffect(() => {
    fetch(API+'/products').then(r=>r.json()).then(setProds);
    refreshUser();
  }, []);

  const refreshUser = () => fetch(API+'/users/'+user.id).then(r=>r.json()).then(setMe);
  
  const buy = async (pid) => {
    await fetch(API+`/users/${user.id}/buy/${pid}`, {method:'POST'});
    refreshUser();
    alert('¡Agregado al carrito!');
  }

  return (
    <div style={{...styles.container, alignItems:'flex-start'}}>
      <div style={styles.dashboard}>
         <div style={styles.header}>
            <h3>🛒 Tienda Virtual</h3>
            <div>Hola, {me.name} <button onClick={onOut} style={{background:'#dc3545', color:'white', border:'none', padding:'5px 10px', marginLeft:'15px', borderRadius:'4px', cursor:'pointer'}}>Salir</button></div>
         </div>
         
         <div style={{display:'flex', gap:'30px'}}>
            <div style={{flex:3}}>
               <h2>Productos</h2>
               <div style={styles.grid}>
                  {prods.map(p => (
                    <div key={p.id} style={styles.card}>
                       <strong>{p.name}</strong>
                       <p style={{color:'#666'}}>{p.brand}</p>
                       <h3 style={{color:'green'}}>${p.price}</h3>
                       <button style={styles.btn} onClick={()=>buy(p.id)}>Comprar</button>
                    </div>
                  ))}
               </div>
            </div>
            
            <div style={{flex:1}}>
               <div style={styles.cart}>
                  <h3 style={{marginTop:0}}>🛒 Mi Carrito</h3>
                  {me.myProducts && me.myProducts.length > 0 ? (
                    <ul style={{paddingLeft:'20px'}}>
                      {me.myProducts.map((p,i) => <li key={i} style={{marginBottom:'5px'}}>{p.name} - <b>${p.price}</b></li>)}
                    </ul>
                  ) : <p style={{color:'#999'}}>Vacío</p>}
                  <hr/>
                  <h3 style={{textAlign:'right'}}>Total: ${me.myProducts?.reduce((a,b)=>a+b.price,0) || 0}</h3>
               </div>
            </div>
         </div>
      </div>
    </div>
  )
}
export default App;