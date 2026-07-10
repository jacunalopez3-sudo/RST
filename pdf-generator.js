(() => {
  const FIXED_LOGO = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAcFBQYFBAcGBgYIBwcICxILCwoKCxYPEA0SGhYbGhkWGRgcICgiHB4mHhgZIzAkJiorLS4tGyIyNTEsNSgsLSz/2wBDAQcICAsJCxULCxUsHRkdLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCz/wAARCADDAmwDASIAAhEBAxEB/8QAHAABAAICAwEAAAAAAAAAAAAAAAYHBQgBAwQC/8QAVBAAAQMCAgUEDQcJBwIFBQAAAQACAwQFBhEHEiExQRNRYXEUFyIyN3N0gZGhsbLRNUJSU1WUwRUjMzQ2YnKSkxYkVIKz0vBDwkSEouHxJSdWZOL/xAAaAQEAAgMBAAAAAAAAAAAAAAAABAUCAwYB/8QAMxEAAgIBAQUGBgEEAwEAAAAAAAECAwQRBRIhMVETFDIzQXEiNFJhgZEVocHR8CNCseH/2gAMAwEAAhEDEQA/ANiEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREBU2kPSLfsNYukt1vfTCnbDG8CSHWOZBz25qL9uTFn1lF93HxXzpi8Ik3k0PsKgi63ExKZUxlKK10Ka66am0mT3tyYs+sovu4+KduTFn1lF93HxUCRSe5Y/0I1dvZ1J725MWfWUX3cfFO3Jiz6yi+7j4qBInc8f6Ee9vZ1J725MWfWUX3cfFT/Cs+kW/wsq66ehtdI8ZtMlLnK8c4bns8/oUd0QYEirssR3OEPhY4ikieNjiN7yOIB2Dp2qzsYYlhwphqpuUgDpG9xDGf+pIe9H4noBVHmTq7TsaILXqTqYz3d+yT0I5jHHkGC4W0j6p9yur26wia1sbWDndkNnVvUKs2kjHOJLw2gtUNG6R+3LkM2xt4uc7PYBzqvXvuGIb2XHXq6+ul4b3vJ/51ALZDAuDabB9jbAA2StmAdUzAd87mH7o4elbL6qcKpKS3psxrlO+fB6Iy9to66Kgjbca1tTVZd2+KIRsz5gNuzrXhxLiS14Ut3ZVyq3NLtkcTcjJKeZo/HcF040xlRYOs5qZwJamTNtPTg5GR3P0NHErXC73i5YmvLqytlfU1Ux1WtaMwBwa0cB0KJh4Usl78+ETdfeqvhXMmtx01X+asc63wU1LT/NZIzlHdZOz1L12XH2kXEUupaqKCqAOTnimAY3rcTkshgfQ4HMjuGJmnb3TKEHd4wj3R51b1NSwUdMynpoWQwxjJscbQ1rR0ALfkZGLX8FUE31NdVds/inLQh9jp8f9m0817qrSyk1vzsMMZMhGXA7t+S9mO7vWWHBVdcaB7WVMOpqOc0OAzcAdh6Cs5W3GjpqimpZqmOOepeGxRl3dPO/YPMotpU8Gt06o/faq+t9pdHeS0bRJkt2D0ZU/bexf/jaf7s1O29i//G0/3ZqhCLre50fQv0U/bWdSb9t7F/8Ajaf7s1O29i//ABtP92aoQidzo+hDtrOpN+29i/8AxtP92auRpexeD+uU33Zqg6J3Oj6EO2s6lhU2mnE8Thy0dDUDiHRFufnBUntGnGhme1l2tctLnvlgdyjR/lOR9qpZFqns7HmvDp7GccmyPqbYWm826+UQq7ZWRVUJ3uYdrTzEbwete5ap2O/XHDtyZXW2odDM3Y4b2vH0XDiFsTgvGFJjCzdkxAQ1UWTaiDPMsdzjnaeBXP5mBLH+JcYljRkK3g+ZI0RFWkoIiIAiIgCIiAIiIAiIgCIiAIiIAiIgCIiAIiIAiIgCIiAIiIAiIgCIiAIiIAiIgCIiAIiIAiIgCIiAIiIAiIgCIiAIiIDXzTF4RJvJofYVBFO9MXhEm8mh9hUEXbYXy8PYor/MYREUs0heu12+W7Xekt8APK1UrYm9GZyz8w2+ZeRWToUsnZ+LZrk9ucdvi7k5bOUfsHq1lHybexqlPobKob81EvO3UEFrttPQ0zdWCnjbGwdAGSojTLiM3XFQtcMmdNbRqkDcZT3x8wyHpV4X66x2OwVtyly1aaJ0mR4kDYPOclrngzDtRjjGIjqC50Jeaisk/dzzIz53HZ/8LndmxScsizlEssltpVx9SwtDWDBT039pK6L89MC2ka4d6zi/rO4dHWrIv99osOWSouVc/VihGwDe93Bo6SvcxkVLTNYwNihiaAANga0D2ALXbSPjGXGOIW0lCXvt9M/k6djASZnnYX5cc9w6Ota64Sz8hyly9fsjKTWPXouZgr3ebpjTErqmVj5qmocI4YIxnqD5rGj/AJxKurR3o0p8MxMuNyaye7PHW2nHM3ndzn0Jo10dR4YpW3K4sa+7TN3HaKdp+aOnnPmVgnIBbM3NUl2NPCK/qY0UafHPmNwVcY/0p02HTJbbSWVVz3PcdscHXzu6PTzLFaStKXYplslgn/PjNlRVsOyPnaw8/OeHWsJgTRNU3rk7nfxJTUTu7ZBukm6XfRB9J6FhRiwrh22TwXoup7ZbKT3KuZjtHsd7xFpFo71UCorGwSl09S/vWdyQBnu47grsxHYocSWCotVRNJDFPq5vjyLhkQdmezgshT0FLbKCKlo6eOngjyDY425ALsUfIynbYpxWmnI21VbkXF8dSsO0ZZvte4fyx/BQDSJg2lwbcaKmpKqeobUROkJlDQQQ7LZktjlSenT5etPkz/fU/Ay7rL1GctUR8imEIaxRVqzGE7NFiHFVBap5XxR1Ty1z2ZawyaTsz6lh1KtGfhKsvjXf6bl0GRJxqlKPPRldWtZJMsXtGWb7XuH8sfwXDtBloLe5vFeD0sYfwVoIuR7/AJH1lz3eroUpd9B9fBC6S03SOsIGfJTs5Jx6nAkenJVrX2+rtdbJR11PJTVEZydHIMiP+c621Vf6XsOwXPCUl0bGBV27J4eBtdHnk5p6NuasMPaVjmoW8UyNdixUXKBQKkmA8Rvwzi2kq9cimlcIahvAsccs/Mcj5lHFwRmCOddBZBWQcH6ldGTi00bfetFicK1rrjhC01bjm+aljc4851QD6wssuEkt1tM6BPVahERYnoREQBE37hn1IgCJkQNxRAEREAREQBERAEREARACdwJRAETdvRAEREAREQBERAEREARMiN4ITbzIAiIgCIiAIiIAiIgCIiAIiIAiIgCIiAIiIAiIgNfNMXhEm8mh9hUEU70xeESbyaH2FQRdthfLw9iiv8xhERSzSFsboksZs+BYJpGas9e41L89+qdjR6APSqNwjh+XE+KKS2MB5N7taZw+bGNrj6NnWVtPFHHBCyKNoYyNoa1o3ADYAqDbF/BUr3ZYYVfFzZWum67upsNUlqiJMlfNm5o3ljNuXncWrP6N8JDCuF42TMAr6vKapPEHLYzzD15qP2ukGPtJtRf5Rylnsrux6TPa2aQHMuHQDt/lUzxbialwph+a41JDnDuYos9srzuaPx5hmq2cpKuONDm+L9yTFJydrIPpixp+Trf/AGeoZcqmqbnUOadscZ+b1u9nWminR3+TYo7/AHeH++yDOmheP0LT84j6R9Q6Vj9HeC6rEV3djDEjTKZZOVgieP0juDyPoj5oVybAFnfaqK+7Vfl/2PIQ7SXaT/A2AKp9J+kd9K9+HrDKXVj/AM3UTx7THns1G5fOPq6179JekJ9qzsFjcZbtUZMe+MaxhB3Afvnhzb+ZNHGjNlhDLveWCa6v7pjCdYU+ftfzngsKK4Ux7a78Lr/8PbJSm9yH5Z4dHWiptByV4xBCJKvY+GldtbF0v53dG4datfIJlkFwXAbyot1075b0zdXCNa0R8T94P4gutQqp0k0dZjm34ctWpVNkm1aipzzYMgTqs5zmNp3KarGdcq9N5aa8TKM1LkFSenT5etPkz/fV2Kk9Ony9afJn++p2zPmF+SPleWyrVKtGnhKsvjXf6blFVKtGnhKsvjXe45dPleTP2ZU1eNGyiJlsTI8y4Y6AKM6RaqOk0eXh8hA14DE0Hi5xAAWauV2oLPSuqLjWQ0sTRnrSuDc+obz5lRGkfSD/AGsnZQ0DXx2uB2sC7Y6Z30iOAHAedTsLGndamlwRHvtjCD6kEXI3rheihoprlcIKKnaXTVMjYmAc5OS7JtRWrKRLV6Gymj+J0Ojyxsfv7FafTmfxUiXRQ0kdvt1PRxfo6eJsTepoA/Bd64KyW9Ny6nQxWkUgiKPYyxfR4Ps5qpwJaiTNtPADkZHfg0cSkISskoxXFiUlFasyF7v9sw7QGrudUynj3NB2ueeZo3kqpb/psr53visVIyli3Caca8h6Q3cPWq+vl+uOIrm+uuVQZpXbANzWD6LRwCxq6bG2XXBa28X/AEKu3LlJ6Q4IzVfjDEdzcTV3uteD81spY30NyCxbqyqc7WdVTuPOZXZ+1dKK0jXCPBJERyk+bMlSYivVA8OpbvXQEfRndl6M1MLHpkxBb3tZcRFdIBv1wGSeZw2ekKvUWuzGpsWkooyjbOPJmzuF8a2fFkBNDOWVDRnJTS7JG+biOkKQrUekq6igq46qknfBPEdZkjDk5pWwejvHseLaA01XqRXWnbnI0bBK36bR7RwXOZ2z3R8cOMf/AAs6MlWfDLmfGlLEt0wxYqKptU7YZZank3F0Yfm3VJ3HpVXdtvGH2hD92Z8FPNOX7LW3yz/sKo5WGzceqyhSnFNkbJsnGzRMmvbbxh9oQ/dmfBO23jD7Qh+7M+ChSKy7nR9C/RG7azqW/grStMWXGfFNxjMcTWcgxkID3OJOYAbv4LwX7TZcqlzorJSR0UW4SzDlJD05bh61V6LQtnUKbm1+PQz7zZu7upl6/FV/uby6svNbNnw5ZzW+gZBY9tbVtfrNqpw7nErgfauhFNVUEtEkaXKT5sktn0g4nskjTBdZp4h/0ak8qw+naPMVdGCNIlBi+PsZ7RSXJjc3QE5h44lh4jo3ha5Lvo6yot9bDV0sroaiB4fG9p2tIUHJwKro8FozfVkSg+PFG26LD4TvzMS4Yo7owBrpW5SMHzXjY4elZg7lyMouEt1+hcpprVGvdXpYxfFWzxsr4Q1kjmgdjs3AkDgurtt4w+0IfuzPgolX/KVV45/vFeddnDEocV8CKN3Wa8ya9tvGH2hD92Z8F9w6WsXOnjD7jDql4B/u7N2e3goOiyeHQ/8AqjxXWdS9cSaZbVbXPp7PCbnONnKE6sQPXvd5vSq1u+kvFV3e7Wuj6SM/9OlHJAecbT6VFEWqnAoqXBav7mU8ic/U9MtwrZ3a0tbUyHnfM4/ivRRYgvFukD6O61kDh9Cd2XozyWPXCmOuDWjSNO8+pauE9MtXBPHS4jaKiA7Oyo25PZ0uA2OHVt61ctPUQ1dNHUU8rZYZWhzHsOYcDuIWoqtjQxiqSOtkw5UyF0MjTLS5nvXDa5o6CNvmKotobPjGLtqWmnNFhjZLb3JlzKI6S7/cMN4R7OtkrYqjsiOPWcwOGRzz2HqUuVf6aPB//wCbi/7lT4sVK6Kly1Jtz0g2itu23jD7Qh+7M+CdtvGH2hD92Z8FCkXXd0o+hFN21nUmvbbxh9oQ/dmfBT7RVjG9YorrlHdalkzIImOYGxNZkS4g7lRitfQT8p3jxMfvFQs7GqhRKUYpM349s5WJNlzoiLlS3Co7FukvFFpxfdKCkrYmU9PO6ONpgY4gDpIV4rWPH/hCvnlTvwVtsuuFlrU1rwIeXOUYpxZk+23jD7Qh+7M+CsvRVim7YooLjLdahkz4JWNYWxhmQLSTuWv6ujQT8lXjx8fulWO0cequhyjFJkXGsnKxJstZERcwWwREQBERAa+aYvCLMOPY0PsKgi2vuOGbJfBrXK10tW/dryRguy5tbeo9U6H8HzuzbQSwdEVQ8D1kroMbalddahJPgVtuJKUnJM1xXrtlrrbxXsorfTSVNQ87GRjPznmHSVsBT6HMIQSBzqOonA4S1DiPVkpba7JbLLTchbaGCkj4iJgbn1nefOtlu2Iaf8ceP3MY4UtfiZG9HmBIsG2pzpyyW5VIBnkbuaODG9A5+JTGF1q7jVjCdjkyuFU3OqnG6jgO9x/eI2AKTXOOulpDFb5YoJX7DNI3W5Mc4bxPNnsXgtloocL2+UwtmnmmeZJpnDlJ6mQ8SeJ6Nw6FR9q5Tds+LJ+5pHcjyPqnhtOC8LNjDm0tvoItrnH0k85J9ZUGt1krNJd/ZiG+QvgsdOf7hRP2GUfTcOY+vdu3yV+G6nE1xircRgNo4Ha9Na2u1mA8Hync93QNg6VKwGsaAMgAMsuZeq3s9XHjJ+vT/ep5ub3Pkg1rY2BrQGtAyAAyACgePsfutEgsViaau+1OTGtY3W5HPiRxdzDzldeJMcVtzr34ewZH2ZcT3M1WNsVMOJ1t2fTw6SsngrAFHhWN1VNJ2ddpwTNVv2nM7w3PcOneVlCEalv2/hf5+x5KTn8MP2eDAGjpmH3fla7uFXep83Oe46whz3gHi7nd6FPgMgmWQWOvd9t+HrZJX3KpbBAzidpcfogcT0LTOc756vi2bIxjXHRcj2VNTDSU0lRUSsihiaXPe85BoHElUTpC0qTXzlLXZHvgt21skw7l8/VzN9ZWFxzpDuGMagwN1qW1sdnHTg7XcznniejcPWo3arRX3utFJb6d08pGZy2Bg53E7GjpKv8AD2fGpdrfz/8ACuuyXN7lZm9Go/8AuNZvHH3StlhuVB4IitVq0gWmhppGXKtdKRLVjPkY+5ObYh8487z5hxV+cFB2rLftTXQkYa0gwqT06fL1p8mf76uxUnp0+XrT5M/31r2Z8wvyZZXlsq1d1LV1FDVMqaWZ8E8ZzZJGcnNO7YV0ouuaT4MpkZr+2OJPt64f13Lh+LsRyN1XX24EH/8AYcsOuFr7Gv6V+jLfl1O2eonqpOUqJpJn/SkeXH0ldSItiSXBGOoV0aJsBy0Lm4hukJjmc3KlheMiwHe8jgSN3QqXVj4B0o1Vllitt6lfU209y2Zx1n0/n3lvRvHBQNoQtnS1V+SRjuCnrMvdF8xyMmibJG9r2PAc1zTmCDuIX0uOLs6qqphoqOaqqHiOGFhke48GgZkrWHF2JajFeIZ7jMS2MnUgjJ2RxjcOviekq4NM16db8Ix2+N2rJcZdR2X0G7Xek5BUIuk2RjpRdz5+hV5lmr3EFl8OYauWKboKK3RazhtkkdsZG3ncfw4rG01PLV1UVNAwvmmeI2NHFxOQC2cwhhilwph+GghDXTHu55eMknE9Q3DoUzOzO7R0jzZpx6e1fHkRux6HcPW6FrriH3Soy7ovJZHn0NH4lSVuCsMNj1BYaDV3foR7VnEXLzybZvWUmW0aoRWiRCbvomwtconchSOt0x3SUziAD/CcwVTuMcD3LB9W0VGU9HKcoqlg7l3QR813R6FswvFeLTR3y01FuroxJTzt1XDiDwI5iDtClY20LaZJSeqNNuNCa4cGanL32W71VhvNNcqN2rNTv1gODhxaegjYvq/2afD9+q7XU7X079UO+k3eHecZLHLrPhth1TKfjF/c2TvNjtmkrC9umdUzQ0zyKmN0WWeZaQWnPmzPoUd7R1k+06//ANHwXXoRvRqbLXWiR2bqOQSxgn5j948zh61aK5Gy27EnKmEtEi5jCF0VOS4mr2M7FBhrFlXaqaWSWKAMIfJlrHNoPDrWCUx0reEq5dUX+mFDl1ONJypjKXPQqLElNpBS3C2ji+Yoa2ojiFHQu3VE4IDh+6N7vZ0rLaIcNW2/XqsnuUAqBRMY+OJ3eFxJ2uHHLLduV9ABoAAAAGQA4Ksztoypk6q1x6kvHxlNb0uRAbTocw3QxtNaJ7lLxMj9Rvma34rIVui3CVXSuiba20riNkkL3Nc08+/b51L0O5UTyrpPecmWCpglpoaoXu1yWS+1tsldrPpZXRl30stx84yK8Ck+kjwkXvx49xqjC7KibnXGT5tFHYt2TSLs0GVjpLFdKQnNsNQ17Rzazdvuq0lUegj9Dev4ovY5W4uS2gtMmWhc43GtFazaErLNPJK6514Mji4ganE58yjWOdGFswtheW6UtbVzSMkYwNl1dXujlwCu9QbTB4Oqjx8XvLdjZl8rYxcuGphbRWoNpGvSIvuJgkmjYTkHODc+s5LrG9FqU6WvA9VrtFfe65tHbaWSqnd81gzyHOTuA6SrTw/oRbqNmv8AXHWO3selOwdBefwCsnD+HLZhm2torbTiJm97ztfIedx4lZVcvk7Usm9KuC/qWtWJFLWXFkUh0Y4Qgi1BZYpP3pHucT581W2lLANBhuCnulpa6Kmlk5KSEuLgx2WYIJ25HI7Feir7TT+wTPLI/Y5acLIt7eKcnxNl9UOzbSKCWYwlWOoMY2ipYciyqjB6i7I+orDr22X5ft/lMXvhdXatYST6FRDhJG2J2HJYXFWGabFll/JtXPLBHyjZdaLLPMZ8/Ws2e+PWuFwkZOEt6PM6BpSWjKy7R1k+06//ANHwVXY3w/BhjFc9rpppJoomMcHSZax1m58Fs8td9LnhIrfFQ+4r3ZuTbbduzlqtCvyqoQhrFEJVr6CflS8eJj94qqFa+gn5UvHiY/eKs9o/LyIuN5qLnREXGl2DuWsWPvCFfPKnfgtnTuWsWPvCFfPKnfgrrY/nS9iDm+BEeV0aCfkq8+Pj90ql1dGgn5KvPj4/dKtNqfLv8EPE81FrIiLkS6CIiAIiIDiGtpXVL6RtRE6pjAc6IOGu0HcSN+S9IOxRS/YPseJqx0j5HU12gaMqmll1J4x83PLeOtYGaXSDg/bqx4qtzPnAatQ0dOW/1rfGpTWkZcej4Gpzcea4FlIoHZ9L2G7i/ka2SW01IOTo6ppAB5tYbPTkprS1tNXQialqIqiM7nxPDh6QsJ1Tr4TWhlGcZcmd64yTNM1rMzrne6KJzmROlcBsY0gE+nYovcbDe8TExXOvFstju+pKJxMso5nykDIdDR51LV8rKMnF6oxa14M8FnslusNA2jtlJHSwN+awbSecneT0lZBYy84htWH6Yz3SuhpW8A93dO6m7yq3uOnSjE746G1VMkIOQldI1hd5sjkt9WPde9YrUwlZCvg2S/GmP7dg+mLXtdVVzxnHTs9rnbmj1rXzEWKLnim5GsuVRyhGyONuxkQ5mj8d5Vx4XxXPjCXVp7BWCAnu6iRzTE3znf5s1lbk/A+H7rCLn+TG3Md2zXjaHNPOchs86scaccR7u5rMi2xdy13tEVJYdHs9RbzecQ1H5FszBrGSUZSSjmY3p5z5gV5b/i2GWidZcO0ptdlB7poP52qP0pHbz1KzcV4Yp8duZWC8zAMH5tsbxJA3pAHHpzzVcXfRnf7YDJBEy4RDjAe6/lO30ZqwouhdLeulx6ei/wAkedcoLSC/J59G3hHs3jj7rlssNy1s0dRPh0mWiOVjo5GzEFrhkR3LuBWyY3Ku2vxuT+xKwvA/cKk9Ony9afJn++rsVJ6dPl60+TP99aNmfML8meV5bKtWfwRbKW842tlvrozLTTyFr2hxGY1HHeOkBYBSrRp4S7L413+m5dRktqqTXRlTWtZrUuHtT4P+zH/13/FDomweQR+TXjqnf8VM0XG96u+t/su+yh0K+q9DGGJ2EQOraV3Asm1wPM4FQPFGiK7WOnkrLfKLpSxjWcGt1ZWDn1fneb0K/UW+raF9b8Wq+5rnjVyXLQ1BRTvS3h2Gx4ubUUsYjp7hGZgwDINeDk4D1HzqCLrKLVdWpr1KecHCTiy7dC+J31tsnsNTIXSUQ5SAnfyRO1vmPqKtFa3aMK51DpEthBybO50DukOafxAWyK5badKqv1XJ8S3xZuVfH0KN04VZlxTQUmfcwUutl0ucfgqzU/0zZ9sA+SxfioAujwVpjw06FZe9bGeihrqm2V8NbSSmKohdrRvABLTz7VIe2XjD7dn/AJWfBRZFInVXN6yima1OUeTJT2y8Yfbs/wDKz4J2y8Yfbs/8rPgosiw7tT9C/R72s+pKe2XjD7dn/lZ8Fz2y8Yfbs/8AKz4KKondqfoX6Haz6nuu15r77W9mXKpdU1GqGa7gAchuGwLwoi3RiorRLgYNtvVk80O1xpMfxwZ5NrIJIiOcgaw91bBLWHAdT2Lj6yy55f3prT/m2fitnly+146XJ9UW2G9YNGuWlbwlXLqj/wBMKHKY6VvCVcuqP/Taocr/ABPIh7IrrvMZbOgn9evXioveKuVU1oJ/Xr14qL3irlXM7S+Yl/voWmL5SCHciHcq4lGtOkjwkXvx49xqi6k+kjwkXvx49xqjC7nF8mHsigt8b9y4tBH6G9fxRexytxVHoI/Q3r+KL2OVuLlto/MyLfG8pBQXTB4Oqjx8XvKdKC6YPB1UePi95aMTz4e6M7vLZr2u2l/XIfGN9oXUu2m/W4fGN94Ltp+FlEuZtyicSi4A6FBV9pp/YJnlkfscrBVfaaf2CZ5ZH7HKXhfMQ9zVf5bKCXts3y/bvKYvfC8S9tm+X7d5TF74XZ2eBlHHmjbI98etcLk98etcLgTogtd9LnhHrfFQ+4tiFrvpc8I9Z4qH3FbbJ8/8Mh5nl/khKtfQT8qXjxMfvFVQrX0E/Kl48TH7xV5tH5eRAxvNRc6Ii40uwdy1ix94Qr55U78Fs6dy1ix94Qr55U78FdbH86XsQc3wIjyujQT8lXnx8fulUuro0E/JV58fH7pVptT5d/gh4nmotZERciXQREQBERAUHpWrqq3aT31NFUy007KeHVkieWuGw8Qvfh3Tbc6LUhvlK24RDZy0WTJR1jvXepYnTF4RJvJofYVBF11GNVfjw316FNZbOFkt1mw3Z2j7SLGGzGmdVOGwS/mahvUdmfpKwNfoYrLfManDF+mpnbwyVxYf52fiFS/4KzMES4htNEy7XK/T2uys2tjndrmboa12eQ6vNzqLbiTxlrVZw6PibY3Rsek4/lGUoo9Lttr46QyGeMnLlp9SaMDnLu+/FS6548ZhS3Ri91EdRWluZZDCWl56G57B0kqJ1OnbkriW01nE9I3Zrvk5N7unLIgKRYd0n0WKqvsZtgrcx37yGSRxjpcSPioVtVvCdlS0+3A3wnDwxnxIZV6drzJM4Udsoooye45Que7z5EBeyiuOkzF0YcKptopH/PZEIyR0Da4+pWiDZ2uDhQwhw25iBua7zdYW95G8+gLW8itL/jqSf34mSrk/FMryi0O0lRN2Rd6ytuE7trnyy6mftd61IqbRng+3ASS2qnkc3bnKXOHoJ2rMy3eUtOqGxtG8nbkseyrZWZyMnbOActZrtYela3dfNcZaIzVdceSPfPWsbB2NSRiGIDVGoNXIdAG5QO4aMrBXyyTf3yGaQlzntnLyTznWzzUvRK5yqesHoJRU+ZWcmi652ubsiwX50TxuD84yfO3YfOF3R4nxlhvub/aDX0zd9RCBrAc+bdh84CsZFJ705cLEmauxS8L0I/h7EOGsUXajngMJuEL9ZjZmBszDkc8jx8xU/UTgw9aX4gpLl2DCyshk1mysbqnPIjblv38VLFByXFyW6SKk0uIVJ6dPl60+TP8AfV2Kk9Ony9afJn++pGzPmF+TVleWyrVKtGfhLsvjXf6blFVKtGnhKsvjXf6bl0+V5M/ZlVV40bKIiLhi/CIuqqqoKKlkqamZkMETdZ8jzkGjnKJa8jzUqLTu9hnskf8A1A2Zx6s2/iqjUmx9igYsxTLWRawpIm8jTh2/UHzj1nM+hRldrhVuqiMZcyjvkp2NokGBGl+PrKGjM9lMWzy150RW11dpAp59XOOijfO48xy1W+srYZUW15J3JdEWGEvgbKO04UZixRQVeXcz0upn0tcfwKrJX7pjsjrlg5tdE3Wlt0nKHL6DtjvwKoJW+zLFPHS6cCFlR3bH9zP4KtltvWLKS23V0rKeq1o2uieGkPyzbtyO/LLzq3e0rhf624/eB/tVDQzSU87Jonlkkbg9jhvaQcwVsvgfFtPi6wR1LXNbWRAMqYhva/nHQd4UXajurasrk0jdibktYyXEwPaVwv8AW3H+uP8AanaVwv8AW3H+uP8AarCRUnfL/rZO7CvoV72lcL/W3H+uP9qdpXC31tx/rj/arCRO+X/Wx2FfQr3tK4X+tuP9cf7U7SuF/rbj/XH+1WEid7v+tjsK+hBKHRBhu33CnrIZbhytPI2VmtOCM2nMZ9yp3xRFpstnY9ZvUzjCMPCjXLSt4Srn1R/6bVDlMdK3hKufVH/ptUOXaYnkQ9kUl3mMtnQT+vXrxUXtKuVU1oJ/Xrz4qL3irlXMbS+Yl+P/AAtMXykEO5EO5VxKNaNJHhIvfjx7jVGFJ9JHhIvfjx7jVGF3OL5MPZFBb437lxaCP0N6/ii9jlbiqPQR+hvX8UXscrcXLbR+ZkW+N5aCgumDwdVHj4veU6UF0weDqo8fF7y0Ynnw90Z3eWzXtdtN+tw+Mb7wXUu2m/W4fGN94Ltp+FlEuZtzxKJxRcAdEgq+00/sEzyyP2OVgqvtNP7BM8sj9jlLwvmIe5pv8tlBL22b5ft3lMXvheJe2zfL9u8pi98Ls7PAyjjzRtke+PWuFye+PWuFwJ0QWu+lzwj1viofcWxC130ueEit8VD7it9k+f8Agh5nlkJVr6CflS8eJj94qqFa2goj8q3gZ7eQjOX+Yq72j8tL/fUgY3mouhERcaXYO5ax4+8IV88qd+C2CxLiq1YVt5qbjOA4j83C3bJKeYD8dy1rvt1dfL/W3N0QhNXKZdQHPVz4Zq+2RXJTc2uGhXZsloo+pj1dGgn5KvPj4/dKpdXRoK+Srx4+P3SrDany7/BGxPNRayIi5EugiIgCIiA180xeESbyaH2FQeKOSaVkUTHSSPOq1rRmXHmAU60vsMmkiVoLW/3aHMuOQGw7VFGXJtuidFbc2SvGrJVkZSEcWs+gPWejcu0xG1jw06FHcl2ktTL00NswrlPcY47ldxtZRg5xQHnkI3u/dCw14vlwv1Z2TcKh0zx3rdzWDmaNwXgGZPOSrLwVo2MvJ3K+xEM2OipHb3cxf0dHpXtkoULtLHq/95HkVKz4Y8jB4PwBV4icyrq9altuff5ZOl6G9HSrlt1to7TQspKGBsEDNzW8eknielelrQxoa0BrWjIADIALlUGRkzvfHkWNdSrXAKN4gxlTWmpbbqKF1yu0mxlLF80/vHh1LEYixhWXC5f2ewqOWrHktlqW97EOOR6OLuHDas3hbCVHhqlLgeya+bbPUv2uceIHMPbxRVRrjvWfhf5Dk5PSP7Oigw7XXJzazFFV2VIe6bQxnVp4usDvz17FJQGRRhrQ2ONg2AAANH4BdNfX0tropKysmbDBEM3Od/zaehRe3isxtKK6tY+lsIOcFITk6q/ek/d5m8VjpKz4pcEj3hHguZKKSthrmGSmcZIhsEgHcu6jx6xsXozGeWe07lgr5e5KGaC0WqFk91qW/mozsZCwb5H5bmjgOK9tqtQt0RdLPJWVku2apk7555gPmt5gFg4aLUyUtXoZBFDcS6SbZYpn0lKw19Ww5Oax2TGHmLufoCg9VpVxHO88iaSlbwDIdYjzuzUirCusWqRqlfCL0Lvpv1uH+ILNKjcDY9v90xpbKCsqYZYJ5SHDkWtPek7COpXkoWXRKiajI302Ka1QVJ6dPl60+TP99XYqT06fL1p8mf763bM+YX5MMry2VasvhW9R4exTQ3aWF8zKV5cWMIBdm0jj1rErhdbOCnFxfJlPFuL1Rdfb1tv2JV/1WJ29bb9iVf8AVYqURV38Xj9P6knvdnUtuu06zuYRQWRkbuDp5tbLzAD2qAYhxjfMTv8A/qda58QObYGDUjb/AJRv86waKRVh01PWEeJqnfOfBsIuyGGWomZDDG+WV5yaxjS5zj0AK39H2il9NPFd8RRDXYQ+GjO3I8HP6vo+le5GTDHjvS59BVVKx6Iz+ijCkmH8OOrKuMsrbhlI5pG1kY71p6duZ61PERcbbbK2bnLmy7hBQioo+J4IqqnkgmYJIpWlj2nc4EZELWPGeFp8J4iloZA51O7N9NKdz4+HnG4rZ9YPFmFaHFtmdQ1Y1JG91BOBm6J3P0jnHFS8HL7tPjyfM05FPax4czV1ZCyXy4YeubK+21DoJm7Dxa8czhxC7sQ4buWGLm6iuMBY7eyQbWSjnaeP4LErrU4Wx4cUyn4wf3L1w9pms9dEyO8xvt1RuL2gvicefMbR51MIMX4cqWB8V8t7geedo9RWrSZA8AqqzZFUnrFtEuOZNc1qbLXLSPhS1tJku8M7x8ynzlJ9Gz1qCXzThK/WisdtEY3CaqOZ6wwbPSVUiLZVsqiHGXExnl2S5cC0dG+ObtctIDIbvcJKhldE6JrXHJjXjum5NGwbiFdq1LttfJa7rS18RIkpZWyj/Kc1tfTVEdZSQ1MLg6KZjZGEcQRmPaqvatCrmpRWiZLw7HKLTO1ERU5NNctK3hKufVH/AKbVDlMdK3hKufVF/phQ5dxieRD2RQ3eNky0e43p8F1FdJUUctUKpjGgRuDdXIk8etTkadLach+Raz+qxUouW98OtabsGm2TnNcfcyhkTgt1G3cbxJEyQDIPaHZdYzX0dy6qX9Th8W32Bdp3LjnwZdo1o0keEi9+PHuNUYUn0keEi9+PHuNUYXcYvkw9kUNvjfuTfR5jymwWyvbUUM1V2UWEcm8N1dXPn61OaTTbbqusgp22araZpGxgmVmzM5fiqPXts/y5QeUR++FHvwabG7JLiba8icdIrkbYnYSFBdMHg6qPHxe8p2e+PWoLpg8HVR4+L3ly+J58PdFpd5bNel9xP5OaN5GYa4Oy6jmvhF27Wq0ZRF19vW2/YlZ/VYpZgvG1NjSCslp6OWlFK5rSJHB2trAnZl1LWhXNoJ+T7142L3XKgzsGmmlzguJY4985zUWWwq+00/sEzyyP2OVgqvtNP7BM8sj9jlU4XzEPcmX+XIoJeihqBSXGmqXNLhDKyQgbzk4HL1Lzou1aTWjKJPQuvt623P5ErP6rFNMHYsgxhaJa+ClkpmRymItkcHEkAHPZ1rWBXtoR/Yyq8sd7rVz2fhU0078FxLLHvnZPSRZCoHTNRPp8e9kEdxVU0bmnpbm0+wK/lBNKuEpcR4eZVUcZfXW8l7GjfIw980dOwEdSr9n3Kq9OXJ8CTkwc62ka+KQ4LxZNg+/CuZFy8MjDHNFnkXNzz2HnBUfIIJBGRHBcLr5wjbFxlyZSxk4vVF9HTXhoQB4guBfl3nJD255KL33TbcKpjorNQsogdnLTHlH+Ybh61VqKBDZmPB66a+5IllWSWmp6K2vq7lWPqq2plqaiTvpJHaxK86LlWKSS0RGfE4U70e6QKXBlHXQ1FDNVGpka8GN4bq5AjioIi13UxujuT5GUJuD3kXX29bb9i1n9VitCGQTQRygZCRocBzZjNaiHctt6H5OpvEs90LmtpYtePu9muZaYt0rNd470RFUE0IiIDXzTF4RZvJofYVCKenlqqhkEET5ZZDqsYwZlx5gFY+kmx19/0py0lvgMr+xodZx2NYMjtceAUwwngqhwvBygyqK94ykqHDd0NHAesrqq8uFGNBc3oVEqXZa+hiMFaPIbMI7hdWsnr97I97Ifi7p4cFO0XD3NYwue4Na0Zkk5ABU9tsrpb0mTowUFojncMzuVa4qxhV3+4/2bwwTIZTqS1DDkHc4B4NHFy8eL8bVOIawWDDofJFK7k3yM76c8zeZvTx6lMsGYQgwvbu61Za+YDlpRw/db0D1qVGtY8e0s8Xov8mlydj3Y8up34VwtSYXtgghykqJMjNPlteeYczRwCy9ZWU9vopauqlbDBC3We924BdkkjIo3SSPaxjAXOc45AAbyVT+JL9WY+xHBZLUXChEmTOZ+W+R3QBuH4laqq5ZE3KT4erMpyVcdEZeh7J0l4iNVVMfFYKB/cQnZyruAPTz8w2cVOL7eKXDljmrpgAyJurHGNmu7c1o/5uXfaLVTWW1QW+kblFC3IHi48XHpJUBq69uNdJlLbozylrtbnSuy3SObvPVnkB5+dbOF0+Hhj/v9THwL7slGEbRPS0kt0uXd3W5ESzuPzG/NjHMAFitJOK32S2Nt9HIWVtY05uG+OPcT1ncPOps5waC5xAAGZPMteMUXh1+xJV15JMb36sQ5mDY34+dbMOvvFu/LkjG6XZw0RiSc1wiLoitJTo28I1m8cfdctlVrVo28I1m8cfdctlVy+2POXt/ctsPwMKstKmC73ii62+e1U0cscEDmPLpWsyJdnxVmoqyi6VE1OPMlWQVkd1mvI0QYvP8A4WlH/mWrntP4v/wtL96athUVh/LX/YjdzrNeu0/i/wDwtL96auRoexcf/D0Y66ofBbCIn8tf9v0O51lCU+hXE8pHLTW+Acc5i72BSG2aDIGOa66Xh8o4spo9UH/M7M+pW0i1z2lkS9dDJYta9DC2HCNjw0zK2UEcUhGRld3Uh/zHas0iKvlKU3rJ6skqKitEERFiehERAeG72a332gdR3KljqYHbcnDa084O8HpCqfEGhGpje+awVrJmbxT1J1XDoD9x8+SuZOpSaMq2jwM1WUws8SNXrhgrEtscRVWSsaB85kfKN9Lc1inUFY12q6kqA7mMTgfYtths3bEzPOrOO2Z/9ooiPCXozVy3YOxFdXAUdlrJAfnOjLG+l2QUxtOhG81Oq651tNQs4tjzlf8AgPWryJz3nPrRarNrXS8OiM44cFz4kJsmifDFoLZJaZ9xmbt16o5jPoaNntU0YxkUbY42NYxoya1oyAHMAvpFWWWztes3qSowjDhFBERazMp7HmjbEWIMZ1tyoIqV1NMGapfOGnYwA7MucKO9pzF31NF96HwWwaKyr2ndXFQWmiIssWuTbZr52nMXfU0X3ofBcjQ5i4EfmaL70PgtgkWb2re+n6Me51nxAwx08THb2sAPmC+0RVXMmFL4x0Y4kveMrncqOKldTVMuuwvqA05aoG0ZbNywnacxd9TRfeh8FsGis4bTvhFRWmiIssSuT1Zr52nMXfU0X3ofBem3aI8V010pZ5IaPUimY92VSCcg4E8FfSL17Vva04fo8WHWuIO89ai+kKw12JMITW63NjdUPljeBI/UGQOZ2qUIq6ubrkprmiTKKkt1mvnacxd9TRfeh8E7TmLvqaL70Pgtg0Vn/LZH2/RF7nWa+dpzF31NF96HwVjaLcI3bCdJco7oyFrqmSNzOSlD9gBBz5t6nqLRftC2+DhPTQzrxoVy3ohRLSRh24Ynwq2gtrYnTioZJlI/UGQBz2+dS1FErm65qceaN8oqa3Wa+dpzF31FF96HwTtOYu+povvQ+C2DRWP8tkfb9EXudZr52nMXfU0X3ofBWlozw1ccLYcnorm2Js0lQZQI5NcapaBv8ymKLRfn23w3J6aGyvHhW96IREUEkFfYy0UUGIZ5K+2ytt9e/a8aucUp5yBuPSPQqyr9FmLqF5AtfZbRufTSNeD5swfUtjkVjTtG6lbuuq+5GsxYTeprIzR/i17tUYergelgA9ZWZt2h3FNa4dkRU9AziZpQ4j/K3NbBZIt0tr3NcEka1hQXMr7DmiCyWd7ai4Pddahu0CRurE0/w8fOonijRXiS6YquNbQwUYpZ5i+IGoDTq7MtmWxXaijQz74Tdmur+5tlj1tbuhr52nMXfU0X3ofBO05i76mi+9D4LYNFv/lsj7fo19zrNfDocxdl+hovvQ+Cv6ljdFRwxvy1mRtacucABdqKLkZdmTpv+huqpjV4QiIohuCIiAxFexra57g0Bzmt1iBtOW7Nedeq4frZ/hCiuJMZ2rDUbm1EvLVeXc00Zzf5/ojrU2qEp6RitWaJtR4szVXWU9BSSVVXMyCCIZue85ABVBivG1diysbaLPFK2jkdqhjR+cqD08w6PSsVdL3fcd3eOmax0ms78zSxd4zpP4uKtHBuCaXDFPy0urPcZG5Ply2MH0W9HTxVqq4Yi3rOMvRENylc9I8j5wTgqHDNJy9Rqy3KZuT3jaIx9Bv4nipWiq7SDj4PEtltE2be9qKhh387Gn2nzKJCFmVYb240xPHpExwLlI+z2yXOjYcp5Wn9M4fNH7o9ZUp0c4U/IdqNfVx5V9Y0Eg74494b1nefNzKIaNsIflWtF2rY/wC5UzvzbXDZLIPwHtVvVVTDR0stTUSCOGJpe953ADeVKypxriser8mmqLk+0kRfSHib8gWB0MD8q2sBjjyO1jfnO/AdJWE0Q2rk6Cuur27ZnCCMn6LdrvWR6FAsR3qpxViN9UGOPKOEVPFzNzyaOs8ekq9bDamWSw0duZl+YjDXHndvcfSSvbod3x1D1lzPIPtbN70RidIF3/JGDatzHas1TlTx9bt58zc1QysPS5duyLzS2tjs2UrOUeP33bvQB61Xin7Pr3KtX6kfIlvT9giIrAjkp0beEazeOPuuWyq1q0beEazeOPuuWyq5fbHnL2/uW2H4GcPOrG4jgCVHsGX2rv8AaJqmsEQeyUsHJt1RlkDz9KkEn6J/8J9ihujD9nKjyg+6FTE0mijlTfqyLH9LZmiLsWWHlHEt7rPJx359CkahNd4X6Dyb/tcgJsiLxXK826zxCSvq46cO70OO13UBtKA9qLEW7FVlus4gpK+N8x3McC0u6s96y6AIuirrKagpnVFXPHBC3e95yCxNPjXD1VUCCO5R67jkNdpaCesjJAZ1RHHlXU0r7L2PUSw8pV6r+TeW6w7nYct6lyhekP8ASWLyz/agJq7vj1rF199p7dd6G3SxyulriQxzQNUbeO1ZR3fnrVe4kvtskxtZpmVkZjopHNqHbcoyHcdiAsFRrH1TPSYTllp5pIZBKwB0bi07+cLL2282+8Mkdb6tlS2IgPLM+5J3bwsJpG/Y6XxrPagJFROLqCnc4kkxMJJ49yF3rBy4ms9npKWGuro4pTCw8mAXOA1RvA3LI266UV2puXoalk8YORLd4PMRvCA9aIsfc77bLM1pr6yOAu2tadrj5htQGQRYq24ms93m5Giro5JeEZza49QO9ZVAEWMueI7RZ5BHXV0cUhGfJ7XOy6huX3a79bL0HGgrGTlm1zRmHAc+R2oDIIix777a456qGSuiZJRt1pw7McmOn0oDIIsZa8RWq9SyR0FWJ3xjNw1SMhz7QsmSACScgN5QBFgZ8bYdppzC+5xlwORLGlwHnAyWXpKymr6ZtRSTxzwu3PYcwgO9ERAdNZVxUNFNVTu1YoWF7j0BRCmu+LsQRdmWqno6OiJPJ8vtc8DrUkxBQSXPD9bRw5crLGQzpO8D1KO4QxTRQ26Gz3B3YNbSjktWbuQ7I7NvA9BXoPdYcQ3Ce6yWi80PY9axmu2SIEse3n6PYpKuBke6GW0bxxC5XgCLzV9yo7XT8vXVMdPHnkC85ZnmA3lYykxlYK6oEENyj5RxyAeCzM9ZGSAzii+kKqnpMKmWmnkgk5dg1o3Fpy27MwpQolpK/ZA+UR/igJTTEmlhJJJMbSSeOwLsXVS/qkPi2+6F0z3WhprjBQTVLWVVQM44yDm7/mSA9aIvJQXSiujZXUVSycRO1HloPcnm2hAdlbVsoaCerka5zIGF7g3eQOZdVpucV4tcNfAx7I5gS1r8sxty25LH4tudHQ2CphqahkUlTC9kLXZ92ctw9KxODMRWiDD9ut0tfEys7zkiDnrFxyG5ATJYay4nob9V1VPStlD6Y90XtyDhnlmPPzrM8VjrZUWmaprGW4wctG/Ko5NmqQ7bv2bdxQGRRFibjimy2mcw1lfGyUb2Nzc4deW5AZZF4LZe7beGOdQVkc+r3zQcnDrB2r3oAi8b7tQR3I0D6qNtUGcqYzmCG8+e5Y3+22HeyeQ/KkWtnlrZO1f5sskBnkXDXBzQ5pDmuGYIOYIXVVVdPQ0z6iqmZDCwZue85AIDuRYSjxjYK6qbTwXGMyuOTQ4FocegkZLNoAiIgCIiApjSvjC8W7E0lpoqgUsHIxuL4xlI4uBzGtw8yiOH8CXnEcomex1LSuObqicHN3UN7irzuVpt01+fWvoIpKsMa0zOi1nZDdkSPYuzUd9B38pV3VmqqpQrWj6kCVG/NuT4GHw9hi3Yao+Roovzjh+cmftfJ1nm6BsWWe9kcbnvcGMaM3OccgBzkrwXW6m1wlzLfX1suWyKmp3OJ6zlkFV2J6zG2JSYX2SvpaLPZTxwuyP8Ry7o+pa66pXy3pS/LMpzVa0SPTjfSOatslsskhbAe5lqhsLxxDeYdPFRrB+FKjFFzEY1o6KIgzzAbh9EfvH/AN167Bo6vl3rwyro6i30rSDJLLGQcuZoO8+pXParPTWW3R0VDTmKGMbtU5k8STxJ51YW31YsOzp5kaFc7Zb0+R20lJBQ0cVLTRtighaGMY3cAFV+lDFgnlNgopM44yDVOae+dwZ5t56epTTGN1ututpgs9tq6qtnBAkjhc5sI+kTz8wVR0eCcS3G4MhdaqyEyu7qaeJzWt53En/hWjCrhr21rNl8n4IozWi7D5uN9N0mZ/d6Ha3MbHSHd6Bt9Cty4V0Fst89bVPDIYGF7j+C89ms0GHrJFQ08b+Thbm52oc3u4uPSVXWOqvEuJJRR0ViucVtidn3VO4Omd9IjgOYLCUu93at6R/sZJdjXppxIDdrjLdrvVV836SokLyObmHmGQXjWY/sjiL7DuH9Byf2RxF9hXD7u74K+VlUVopIrnGTeuhh0WY/sjiL7CuH3dyf2RxF9hXD+g5e9tX9S/Y3JdDI6NvCNZvHH3XLZVa+aP8ADd7osfWmoqbTWwQxykukfC4NaNU7ytg1zW1pRlanF68C0w01B6nzJ+if/CfYqwwZX4hpbTKy02qKsgMubnvfkQ7IbN6s+T9E/wDhPsUN0Y/s5UeUH3QqkmnZ+WMa/wD47Tf1P/6WJoqi5VWlChkutIykqORI5Njsxq6rsjvVjKE13hfoPJv+1yAmrnBjC47mgkqsbJe7HUXWsu+IJg+rkkyhjfGXtjYN2Q3dHm6VZ2QIyO0HYVAqCcYHuFVQ3OldJbJ5DJBVNj1w3PgfUiB1YlvGErrapexpWR10Y1oJI4SxwcNwzAUuwxcpLthmirJjnK9mq887mkgn1LD1WOLNqiO2UrrlVP2Mijhyz6yQpVDthYeS5LMAlhyzb0bNi8Bg8TssA7EqL7I0NgcXRxlxIeeI1Rv4KPYgv2FblYqimigLZQwmEtpSzVcN23LYF3YkkZa8fUV1uUD5bdyOo14ZrCN+3bl1nP8A+F6L3iy23CyVlJamvrZpIXA6kZDY25bXOJGzIL08Mtg2pkq8H2+WVxc8MLCTvOq4geoLD6Q/0li8s/2rJYD/AGKof8/vlY3SH+ksXln+1D0mru+PWVBsTUNK3HWH2imhDZnuMgEYyec+PP51OXd8etQvGzjQX6xXeRjnUtNIWyuaM9XaD8fQiBLaekpqRrhTU8UAdtPJsDc+vJRzSL+x0vjY/aspaMR26+TTx0EkknIAEuMZa058xKxekb9jpfGs9q8B7LHh2301qhdNTRVFTNG1800rA9z3EdPDgsHbqaKy6UpqGjbyVNVUxeYxuByz2ecH0qZUPydTeKZ7oUSl8MMPkh9wr0EvqpxTUk05GYiY55HPkM1DcFWqC8Qz4gukbaurqZXBvKDWDAOYH/mQU1ljbNC+J4zY9paR0EZKB2e5PwNLNaLxFKKMyF9PVMYXNIPA/wDNhzQEpqcNWirrIKp9FGyaB4e10Y1MyN2eW9ZXiou3HNHW3CnpLTS1FwdI8B7mt1AxvPt/9lJZ2vfTytjdk9zHBp5jlsK8BEZa7B9kvFXI8tnrZZC6Q6hnLDxAO4LDVF2tc2OrPWWVronSSCKcckYw4E5buo+pd+Eb5a8O0U9Bd2Gjr2SuMj3xE644bcl8Xq7x3jFeH56WnkZSNqA1kz2avKnWbnkOYbNq9BYyr+jtUF10nXdlU3lIIcpDEe9e7YG5jiBmSrAUOsPhKxB/A32hECU01BR0b3vpqWGBzwA4xsDcwN2eSiukS5Op6GjoBMYIqyQiaQcIxln7fUpko3jOzVNyoqaroGh9ZQScqxn0xxHqC8Bj6PEOCKCjFLCYeTAyOtTFxd0kkbV4LBdLbT497HssudvuDO6iyLQyQAnYD1etZemx1YXQ/wB9jNFUN7+GSDMg8ciAvfYb9FfKuc01slhpIgOTqXsDQ88QBvXoM6iIvAFi7vhy13xmVbTNdJlkJW9y8ef4rrxNDdpbSXWacx1Mbg8sAGcgHzcz/wAKxNJpDtwi5O6xVFBVs2SMMRIz6OPpQGOb+UMB3ikgfVPq7NVv1AH74z+BGeezYQrAy25dKr2410mPLvRUduppW2+llEstRI3V9Hm3DftVg8c0BBLPSx4sxdcrhcW8tT0L+Rggd3o2naR5s+sqS3PDNrutC6mko4YyRkySNga5h4EEexRx7p8EYlrKqSnlms9wdrl8YzMTt+0ec9Y6l7a3H9uNMWWkTV1bIMoo2ROGTuBK9B9YAuNRV2SalqnmSWhlMOsTmS3h6NoXxpK/ZA+UR/ivbg2xzWSyFtV+t1LzNKN+qeA/5zrxaSf2QPlEf4p6glFL+qQ+Lb7oUQv3hOw/4s+1yl9L+pw+Lb7oURxrFUW+9WnEEUDp4qM6krW7wM88/WUBMxwUL0cfqt18rPsXrOO7dVxthtUdRWV0vcxwiMtyd+8dwA4rxaNWvZRXNshBe2qycRuJy2+teAz+J6aCfDlc+WGOR0cDywuaCWnLeOZY7BNvon4Ut9Q+kgdNkXcoYwXZ6x255ZrN3mnfV2Otp4hnJLC9rRznJRDCmLrZbcP0dtqjMysjeYjEIiTtdv6tq9BPBvHWobgj5dxJ5V/3OUyG8dahuCPl3EnlX/c5eAzGLbpLaMMVdVAdWbIRsd9EuOWfm2ry4Ww1QUNngnmp46irqGCWSWVoec3DPIZ9ayWILSL3Yqmg1g10jc2OO4OBzCjlmxhDaKOO14gjmoqulbyeu5hc17RuOY6F6D4xlbIbF2NiG1xtpaiCVrZBGNVr2nnG7o86msMongjlAyEjQ4DrGagt2r346qYLXaoZfyeyQSVFU9uq3ZwHr86njGNjjaxoya0BoHQF4CB3i3MuulKKkmc4QOpQZWg5a7QCS3qOxSS6YctVTZp6fsCnjDY3FjmRhpaQNhBG1YeTwvR+RfgVK6v9Rn8W72FAR3R5VSVOEIhI4u5GR0Qz5hkQPWmPLfV11op300BqW004llgbve0e1dOjT9k3eUP9gWTxDe6uxmmnZQOqaIuIqJGHN0Y4ZD8UBh4b1hG/sio6umipZGuBbFNHyZaRw1h7FMwAAANgG5QHFGIcN3qyyxU7Oy6+QZQhsJD2u588vUpdYYaimw/Qw1efLshaH57weY9SAyCIiAIiIBmedM0RAMzzlPOiIAmaIgGZ5ym3nREAzPOmZ5yiIBmecpmecoiAZnnKZnnKIgCIiALhrGsGTWtaOgZLlEAXGq0uDtVusOOW1cogC4c1r2lrmhzTvBGYK5RAdcVPDASYoY489+owN9i7ERAcOY17S17Q5p3gjMFfEcEMLS2OGNjTvDWgArsRAcBoaMmgAcwGSOY12Ws0Oy2jMZ5LlEAXy9jZGFj2tc07w4Zgr6RAfEcUcLNSKNkbeZrQB6l9Oa1wyc0OHMRmuUQDguNRutrardbny2+lcogC+XsZIwtexr2ng4ZhfSID4ihigbqxRMjHMxob7F9oiA65aeCYgywxyEbi9gOXpX1qM7nuG9zu2DZ1L6RAFwGtDi4NAJ3nLaVyiAIiIDqkpqeZ+tLBFI4cXMBPrXaAAAAAANwHBEQBERAF1y00E5zmhjlI+mwO9q7EQHDWNY0NY0NaOAGQXKIgBAIIIBB3g8V1xU8ELiYoY4yd5YwA+pdiIAuHNa8ZOaHDmIzXKIAhAIyO0FEQHXFTwQEmKGOMneWMDc/QvtrGt71rW58wyXKIAusU8Im5YQxiX6eoNb0712IgC4axrSS1oBO/IZZrlEAXxLBFO0CWJkgG4PaHe1faIDhjGxsDWNDWjcGjILlEQHGq3W1tUa3PltXKIgOGtawZNaGjmAyXKIgOplLTxycpHBEx/wBJrAD6V2oiAIiIAiIgCIiAIiIAiIgCIiAIiIAiIgCIiAIiIAiIgCIiAIiIAiIgCIiAIiIAiIgCIiAIiIAiIgCIiAIiIAiIgCIiAIiIAiIgCIiAIiIAiIgCIiAIiIAiIgCIiAIiIAiIgCIiAIiIAiIgCIiAIiID/9k=";
  const COMPANY = {
    name: "Bennu Healthcare Solutions",
    legalId: "3-101804878",
    address: "Uruca, San José, Costa Rica"
  };

  const value = input => String(input ?? "").trim() || "-";
  const fileSafe = input => value(input)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9._-]+/gi, "_");

  window.makePDF = function makePDF(report) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ unit: "pt", format: "a4", compress: true });
    const W = doc.internal.pageSize.getWidth();
    const H = doc.internal.pageSize.getHeight();
    const M = 36;
    const CW = W - M * 2;
    const BOTTOM = 38;
    const LINE = 12;
    const STROKE = [31, 42, 68];
    let y = M;

    function font(size = 9, bold = false) {
      doc.setFont("helvetica", bold ? "bold" : "normal");
      doc.setFontSize(size);
      doc.setTextColor(15, 18, 25);
    }

    function border() {
      doc.setDrawColor(...STROKE);
      doc.setLineWidth(.8);
    }

    function newPage() {
      doc.addPage();
      y = M;
    }

    function ensure(heightNeeded) {
      if (y + heightNeeded > H - BOTTOM) newPage();
    }

    function wrap(text, width) {
      return doc.splitTextToSize(value(text), width);
    }

    function drawHeader() {
      border();
      const h = 108;
      doc.rect(M, y, CW, h);
      try {
        doc.addImage(FIXED_LOGO, "JPEG", M + 12, y + 17, 150, 68);
      } catch (_) {}
      const x = M + 177;
      font(13, true);
      doc.text(COMPANY.name, x, y + 25);
      font(9);
      doc.text(`Cédula Jurídica: ${COMPANY.legalId}`, x, y + 43);
      doc.text(COMPANY.address, x, y + 58);
      doc.text(`Ingeniería: ${value(report.tecnicoBHS)}`, x, y + 75);
      doc.text(`Email: ${value(report.emailBHS)}   |   Tel: ${value(report.phoneBHS)}`, x, y + 92);
      y += h + 14;

      const reportH = 52;
      doc.rect(M, y, CW, reportH);
      font(14, true);
      doc.text("REPORTE DE SERVICIO", M + 12, y + 22);
      doc.text(`R#${String(report.consecutivo).padStart(5, "0")}`, W - M - 58, y + 22);
      font(9);
      doc.text(
        `Fecha: ${value(report.fecha)}   Hora: ${value(report.horaIni)}-${value(report.horaFin)}   Tiempo: ${value(report.duracion)}`,
        M + 12,
        y + 42
      );
      y += reportH + 14;
    }

    function itemLines(label, raw, width) {
      return wrap(`${label}: ${value(raw)}`, width);
    }

    function listHeight(items, width) {
      return items.reduce((sum, [label, raw]) =>
        sum + itemLines(label, raw, width).length * LINE + 5, 0);
    }

    function singleBox(title, items, continuation = false) {
      const textWidth = CW - 24;
      const titleH = 26;
      const all = items.map(([label, raw]) => [label, itemLines(label, raw, textWidth)]);
      let first = true;

      for (const [label, lines] of all) {
        let offset = 0;
        while (offset < lines.length) {
          const minHeight = titleH + LINE + 16;
          ensure(minHeight);
          const availableLines = Math.max(1, Math.floor((H - BOTTOM - y - titleH - 16) / LINE));
          const chunk = lines.slice(offset, offset + availableLines);
          const boxH = titleH + chunk.length * LINE + 16;
          border();
          doc.rect(M, y, CW, boxH);
          font(10, true);
          doc.text(first && !continuation ? title : `${title} (continuación)`, M + 12, y + 18);
          font(9);
          doc.text(chunk, M + 12, y + 38);
          y += boxH + 12;
          offset += chunk.length;
          first = false;
          continuation = true;
          if (offset < lines.length) newPage();
        }
      }
    }

    function dualBox(leftTitle, leftItems, rightTitle, rightItems) {
      const half = CW / 2;
      const textW = half - 24;
      const h = Math.max(
        112,
        38 + listHeight(leftItems, textW),
        38 + listHeight(rightItems, textW)
      );
      if (h > H - M - BOTTOM - 20) {
        singleBox(leftTitle, leftItems);
        singleBox(rightTitle, rightItems);
        return;
      }
      ensure(h);
      border();
      doc.rect(M, y, CW, h);
      doc.line(M + half, y, M + half, y + h);
      font(10, true);
      doc.text(leftTitle, M + 12, y + 19);
      doc.text(rightTitle, M + half + 12, y + 19);

      function column(items, x) {
        let cy = y + 42;
        font(9);
        for (const [label, raw] of items) {
          const lines = itemLines(label, raw, textW);
          doc.text(lines, x, cy);
          cy += lines.length * LINE + 5;
        }
      }
      column(leftItems, M + 12);
      column(rightItems, M + half + 12);
      y += h + 14;
    }

    function columnsBox(title, columns) {
      const colW = CW / columns.length;
      const textW = colW - 22;
      const prepared = columns.map(([label, raw]) => itemLines(label, raw, textW));
      const h = Math.max(62, 37 + Math.max(...prepared.map(lines => lines.length)) * LINE + 10);
      ensure(h);
      border();
      doc.rect(M, y, CW, h);
      font(10, true);
      doc.text(title, M + 12, y + 19);
      font(9);
      prepared.forEach((lines, index) => doc.text(lines, M + index * colW + 12, y + 42));
      y += h + 14;
    }

    function longBox(title, rawText) {
      const lines = wrap(rawText, CW - 24);
      let offset = 0;
      let continuation = false;
      while (offset < lines.length) {
        ensure(58);
        const maxLines = Math.max(1, Math.floor((H - BOTTOM - y - 45) / LINE));
        const chunk = lines.slice(offset, offset + maxLines);
        const h = 35 + chunk.length * LINE + 12;
        border();
        doc.rect(M, y, CW, h);
        font(10, true);
        doc.text(continuation ? `${title} (continuación)` : title, M + 12, y + 19);
        font(9);
        doc.text(chunk, M + 12, y + 41);
        y += h + 14;
        offset += chunk.length;
        continuation = true;
        if (offset < lines.length) newPage();
      }
    }

    function sectionLabel(title, continuation = false) {
      ensure(38);
      border();
      doc.rect(M, y, CW, 38);
      font(10, true);
      doc.text(continuation ? `${title} (continuación)` : title, M + 12, y + 23);
      y += 50;
    }

    function photos(items) {
      if (!items?.length) {
        sectionLabel("IMÁGENES (EVIDENCIA)");
        return;
      }
      sectionLabel("IMÁGENES (EVIDENCIA)");
      items.forEach((photo, index) => {
        let ratio = 4 / 3;
        try {
          const p = doc.getImageProperties(photo);
          ratio = p.width / p.height;
        } catch (_) {}
        let imageW = CW - 18;
        let imageH = imageW / ratio;
        const maxH = 320;
        if (imageH > maxH) {
          imageH = maxH;
          imageW = imageH * ratio;
        }
        const h = imageH + 37;
        if (y + h > H - BOTTOM) {
          newPage();
        }
        border();
        doc.rect(M, y, CW, h);
        font(8.5, true);
        doc.text(`Foto ${index + 1}`, M + 10, y + 16);
        try {
          doc.addImage(
            photo,
            String(photo).startsWith("data:image/png") ? "PNG" : "JPEG",
            M + (CW - imageW) / 2,
            y + 25,
            imageW,
            imageH
          );
        } catch (_) {
          font(9);
          doc.text("No fue posible incorporar esta fotografía.", M + 10, y + 42);
        }
        y += h + 12;
      });
    }

    function signature() {
      ensure(142);
      const h = 130;
      border();
      doc.rect(M, y, CW, h);
      font(10, true);
      doc.text("FIRMA DEL CLIENTE / CONFORMIDAD", M + 12, y + 20);
      if (report.firma) {
        try {
          doc.addImage(report.firma, "PNG", M + 20, y + 30, 300, 85);
        } catch (_) {}
      } else {
        font(9);
        doc.text("Sin firma registrada", M + 12, y + 52);
      }
      y += h + 12;
    }

    drawHeader();
    dualBox(
      "DATOS DEL CLIENTE",
      [["Cliente", report.cliente], ["Responsable", report.responsable], ["Correo", report.correo]],
      "DATOS DEL EQUIPO",
      [["Equipo", report.equipo], ["Marca/Modelo", `${value(report.marca)} / ${value(report.modelo)}`], ["Serie/Activo", `${value(report.serie)} / ${value(report.activo)}`]]
    );
    columnsBox("SERVICIO", [
      ["Actuación", report.actuacion],
      ["Cantidad", report.cantidad],
      ["Estado final", report.estado]
    ]);
    columnsBox("RECURSOS / TIEMPO", [
      ["Repuestos", report.repuestos],
      ["Horas trabajadas", report.horas]
    ]);
    longBox("OBSERVACIONES / DIAGNÓSTICO", report.acciones);
    photos(report.fotos);
    signature();

    const pages = doc.getNumberOfPages();
    for (let page = 1; page <= pages; page += 1) {
      doc.setPage(page);
      font(7.5);
      doc.text(`R#${String(report.consecutivo).padStart(5, "0")}`, M, H - 18);
      doc.text(`Página ${page} de ${pages}`, W - M, H - 18, { align: "right" });
    }

    return {
      blob: doc.output("blob"),
      name: `OT_${String(report.consecutivo).padStart(5, "0")}_${fileSafe(report.equipo)}_${fileSafe(report.marca)}_${fileSafe(report.serie)}_${fileSafe(report.activo)}.pdf`
    };
  };
})();
