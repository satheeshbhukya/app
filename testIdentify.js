async function testIdentify(payload) {
  const response = await fetch('http://localhost:3000/identify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  const data = await response.json();
  console.log('Request:', payload);
  console.log('Response:', JSON.stringify(data, null, 2));
  console.log('-----------------------------');
}

async function runTests() {
  await testIdentify({ email: 'mcfly@hillvalley.edu', phoneNumber: '123456' });
  await testIdentify({ email: 'lorraine@hillvalley.edu', phoneNumber: null });
  await testIdentify({ email: null, phoneNumber: '123456' });
  await testIdentify({ email: 'biffsucks@hillvalley.edu', phoneNumber: '717171' });
  await testIdentify({ email: 'george@hillvalley.edu', phoneNumber: '717171' });
  await testIdentify({ email: null, phoneNumber: null }); // Should return error
} 


runTests(); 