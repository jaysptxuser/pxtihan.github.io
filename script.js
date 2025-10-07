let profiles=[];
let currentPageNum=1;
const profilesPerPage=6;

const profilesContainer=document.getElementById('profilesContainer');
const pagination=document.getElementById('pagination');
const searchInput=document.getElementById('searchInput');
const profileStats=document.getElementById('profileStats');
const volumeRange=document.getElementById('volumeRange');
const volumeValue=document.getElementById('volumeValue');
// Audio setup
const audio = document.getElementById('bgAudio');
audio.loop = true;
audio.volume = 0.5;

// subtle volume/pan animation
let direction = 1;
setInterval(() => {
  audio.volume += 0.002 * direction;
  if(audio.volume > 0.55 || audio.volume < 0.45) direction *= -1;
  volumeRange.value = Math.round(audio.volume*100);
  volumeValue.textContent = volumeRange.value+'%';
}, 100); // ปรับทุก 100ms

// play on load
audio.play().catch(e => console.log("Autoplay blocked", e));


fetch('member.json')
.then(res=>res.json())
.then(data=>{
  profiles=data;
  renderProfiles();
})
.catch(err=>console.error(err));

function renderProfiles(){
  const searchTerm=searchInput.value.toLowerCase();
  const filtered=profiles.filter(p=>p.name.toLowerCase().includes(searchTerm));
  const totalPages=Math.ceil(filtered.length/profilesPerPage);
  if(currentPageNum>totalPages) currentPageNum=totalPages||1;
  const start=(currentPageNum-1)*profilesPerPage;
  const current=filtered.slice(start,start+profilesPerPage);

  profilesContainer.innerHTML='';
  current.forEach((p,i)=>{
    const card=document.createElement('a');
    card.href=p.url; card.target='_blank';
    card.className='profile-card';
    card.style.animationDelay=`${i*0.1}s`;
    card.innerHTML=`<img src="${p.img}" alt="${p.name}"><div><h3>${p.name}</h3><p>FACEBOOK PROFILE</p></div><i class="lucide-facebook facebook-icon"></i>`;
    profilesContainer.appendChild(card);
    setTimeout(()=>card.style.opacity=1,50);
  });

  // Pagination
  pagination.innerHTML='';
  for(let i=1;i<=totalPages;i++){
    const btn=document.createElement('button');
    btn.className='page-btn'+(i===currentPageNum?' active':'');
    btn.textContent=i;
    btn.onclick=()=>{currentPageNum=i; renderProfiles();}
    pagination.appendChild(btn);
  }

  profileStats.textContent=`หน้า ${currentPageNum} จาก ${totalPages} | ทั้งหมด ${filtered.length} โปรไฟล์`;
}

// Search input
searchInput.addEventListener('input',()=>{
  currentPageNum=1;
  renderProfiles();
});

// Volume Control
volumeRange.addEventListener('input',()=>{
  audio.volume = volumeRange.value/100;
  volumeValue.textContent = volumeRange.value+'%';
});
