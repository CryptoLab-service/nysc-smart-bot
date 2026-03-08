with open('.env', 'rb') as f:
    data = f.read()
    print("HEX:", data.hex())
    print("len:", len(data))
