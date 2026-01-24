#!/bin/bash

# Authentication Test Script
# Tests login security with correct and incorrect passwords

BASE_URL="http://localhost:3001/api/auth"

echo "========================================="
echo "🔐 Password Authentication Test"
echo "========================================="
echo ""

# Test 1: Login with correct password
echo "✅ Test 1: Login with CORRECT password"
echo "----------------------------------------"
CORRECT=$(curl -s -X POST "$BASE_URL/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"testuser@example.com","password":"correctPassword123"}')

echo "$CORRECT" | python3 -m json.tool 2>/dev/null || echo "$CORRECT"
echo ""

if echo "$CORRECT" | grep -q '"success":true'; then
  echo "✅ PASS: Successfully logged in with correct password"
else
  echo "❌ FAIL: Login failed with correct password"
fi
echo ""

# Test 2: Login with wrong password
echo "❌ Test 2: Login with WRONG password"
echo "----------------------------------------"
WRONG=$(curl -s -X POST "$BASE_URL/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"testuser@example.com","password":"wrongPassword456"}')

echo "$WRONG" | python3 -m json.tool 2>/dev/null || echo "$WRONG"
echo ""

if echo "$WRONG" | grep -q '"success":false'; then
  echo "✅ PASS: Login correctly rejected with wrong password"
else
  echo "❌ FAIL: Login accepted with wrong password - SECURITY ISSUE!"
fi
echo ""

# Test 3: Login with different wrong password
echo "❌ Test 3: Login with DIFFERENT wrong password"
echo "----------------------------------------"
WRONG2=$(curl -s -X POST "$BASE_URL/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"testuser@example.com","password":"anyRandomPassword"}')

echo "$WRONG2" | python3 -m json.tool 2>/dev/null || echo "$WRONG2"
echo ""

if echo "$WRONG2" | grep -q '"success":false'; then
  echo "✅ PASS: Login correctly rejected"
else
  echo "❌ FAIL: Login accepted - SECURITY ISSUE!"
fi
echo ""

# Test 4: Login with empty password
echo "❌ Test 4: Login with EMPTY password"
echo "----------------------------------------"
EMPTY=$(curl -s -X POST "$BASE_URL/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"testuser@example.com","password":""}')

echo "$EMPTY" | python3 -m json.tool 2>/dev/null || echo "$EMPTY"
echo ""

if echo "$EMPTY" | grep -q '"success":false'; then
  echo "✅ PASS: Login correctly rejected with empty password"
else
  echo "❌ FAIL: Login accepted with empty password - SECURITY ISSUE!"
fi
echo ""

echo "========================================="
echo "🎉 Authentication Test Complete!"
echo "========================================="
